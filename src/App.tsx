import { useCallback, useEffect, useRef, useState } from 'react';
import { FilesetResolver, PoseLandmarker, type NormalizedLandmark } from '@mediapipe/tasks-vision';
import { Camera, Check, Eye, Focus, Gauge, LockKeyhole, Pause, Play, RotateCcw, ScanFace, Sparkles } from 'lucide-react';
import { supabase, isConfigured } from './supabase';

type PostureState = 'idle' | 'calibrating' | 'aligned' | 'slouching' | 'searching';
type Snapshot = { id: number; time: string; score: number; state: PostureState; energy: number; focus: number; strain: number };
type CheckIn = { energy: number; focus: number; strain: number };

const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';
const INTERVAL_MS = 15 * 60 * 1000;
const CONNECTIONS: [number, number][] = [[0,11],[0,12],[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24]];

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const midpoint = (a: NormalizedLandmark, b: NormalizedLandmark) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

function scorePose(points: NormalizedLandmark[], baseline: number | null) {
  const shoulders = midpoint(points[11], points[12]);
  const ears = midpoint(points[7], points[8]);
  const shoulderWidth = Math.max(Math.abs(points[11].x - points[12].x), .04);
  const neckLength = (shoulders.y - ears.y) / shoulderWidth;
  const tilt = Math.abs(points[11].y - points[12].y) / shoulderWidth;
  if (!baseline) return { score: 88, neckLength, tilt };
  const collapse = Math.max(0, (baseline - neckLength) / Math.max(baseline, .08));
  return { score: Math.round(clamp(100 - collapse * 145 - tilt * 24)), neckLength, tilt };
}

function drawPose(canvas: HTMLCanvasElement, points: NormalizedLandmark[], state: PostureState) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const color = state === 'slouching' ? '#ff7657' : '#b9f25f';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.shadowColor = color; ctx.shadowBlur = 14;
  CONNECTIONS.forEach(([a, b]) => {
    if ((points[a].visibility ?? 1) < .45 || (points[b].visibility ?? 1) < .45) return;
    ctx.beginPath(); ctx.moveTo(points[a].x * canvas.width, points[a].y * canvas.height);
    ctx.lineTo(points[b].x * canvas.width, points[b].y * canvas.height); ctx.stroke();
  });
  ctx.fillStyle = '#f8f5ea'; ctx.shadowBlur = 9;
  [0, 7, 8, 11, 12, 23, 24].forEach((i) => {
    ctx.beginPath(); ctx.arc(points[i].x * canvas.width, points[i].y * canvas.height, 6, 0, Math.PI * 2); ctx.fill();
  });
}

const Metric = ({ icon, label, value, suffix = '%' }: { icon: React.ReactNode; label: string; value: number; suffix?: string }) => (
  <div className="metric">
    <div className="metric-top"><span>{icon}{label}</span><strong>{value}{suffix}</strong></div>
    <div className="meter"><i style={{ width: `${value}%` }} /></div>
  </div>
);

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const frameRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const lastInferenceRef = useRef(0);
  const baselineRef = useRef<number | null>(null);
  const latestRef = useRef({ score: 0, state: 'searching' as PostureState });
  const checkInRef = useRef<CheckIn>({ energy: 72, focus: 78, strain: 28 });
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<PostureState>('idle');
  const [score, setScore] = useState(0);
  const [baseline, setBaseline] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [nextSnapshot, setNextSnapshot] = useState(INTERVAL_MS);
  const [checkIn, setCheckIn] = useState<CheckIn>(checkInRef.current);
  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => {
    try { return JSON.parse(localStorage.getItem('upright-snapshots') || '[]'); } catch { return []; }
  });

  useEffect(() => { checkInRef.current = checkIn; }, [checkIn]);

  useEffect(() => {
    if (!isConfigured) {
      localStorage.setItem('upright-snapshots', JSON.stringify(snapshots.slice(0, 12)));
    }
  }, [snapshots]);

  useEffect(() => {
    if (!isConfigured) return;
    const loadFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('posture_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(12);
        if (error) throw error;
        if (data && data.length > 0) {
          const loaded: Snapshot[] = data.map((row: any) => {
            const d = new Date(row.created_at);
            return {
              id: row.id,
              time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              score: row.score,
              state: row.state as PostureState,
              energy: row.energy,
              focus: row.focus,
              strain: row.eye_strain,
            };
          });
          setSnapshots(loaded);
        }
      } catch (err) {
        console.error('Failed to load from Supabase:', err);
      }
    };
    loadFromSupabase();
  }, []);

  const takeSnapshot = useCallback(async () => {
    if (!active) return;
    if (latestRef.current.score === 0 || latestRef.current.state === 'searching') {
      setError('Cannot capture snapshot: No person detected in frame. Please adjust your camera and come into view.');
      return;
    }
    setError('');
    const now = new Date();
    const currentScore = latestRef.current.score;
    const currentState = latestRef.current.state;
    const currentCheckIn = checkInRef.current;

    const localId = now.getTime();
    const localTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSnapshots((items) => [
      { id: localId, time: localTime, score: currentScore, state: currentState, ...currentCheckIn },
      ...items
    ].slice(0, 12));
    setNextSnapshot(INTERVAL_MS);

    if (isConfigured) {
      try {
        const { error } = await supabase.from('posture_logs').insert([
          {
            score: currentScore,
            state: currentState,
            energy: currentCheckIn.energy,
            focus: currentCheckIn.focus,
            eye_strain: currentCheckIn.strain,
          }
        ]);
        if (error) throw error;
      } catch (err) {
        console.error('Failed to save log to Supabase:', err);
      }
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setNextSnapshot((left) => {
      if (left <= 1000) { window.setTimeout(takeSnapshot, 0); return INTERVAL_MS; }
      return left - 1000;
    }), 1000);
    return () => clearInterval(timer);
  }, [active, takeSnapshot]);

  const renderLoop = useCallback(() => {
    const video = videoRef.current; const canvas = canvasRef.current; const model = landmarkerRef.current;
    if (!video || !canvas || !model || video.readyState < 2) { frameRef.current = requestAnimationFrame(renderLoop); return; }
    if (canvas.width !== video.videoWidth) { canvas.width = video.videoWidth; canvas.height = video.videoHeight; }
    if (video.currentTime === lastVideoTimeRef.current || performance.now() - lastInferenceRef.current < 120) {
      frameRef.current = requestAnimationFrame(renderLoop); return;
    }
    lastVideoTimeRef.current = video.currentTime; lastInferenceRef.current = performance.now();
    try {
      const result = model.detectForVideo(video, performance.now());
      const points = result.landmarks[0];
      if (points) {
        const reading = scorePose(points, baselineRef.current);
        const posture: PostureState = baselineRef.current ? (reading.score < 72 ? 'slouching' : 'aligned') : 'calibrating';
        setScore(reading.score); setState(posture); latestRef.current = { score: reading.score, state: posture };
        drawPose(canvas, points, posture);
      } else {
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height); setState('searching');
        latestRef.current = { score: 0, state: 'searching' };
      }
    } catch { /* transient frame errors are safe to skip */ }
    frameRef.current = requestAnimationFrame(renderLoop);
  }, []);

  const start = async () => {
    setLoading(true); setError('');
    try {
      if (!landmarkerRef.current) {
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        try {
          landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' }, runningMode: 'VIDEO', numPoses: 1, minPoseDetectionConfidence: .55, minTrackingConfidence: .55 });
        } catch {
          landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, { baseOptions: { modelAssetPath: MODEL_URL, delegate: 'CPU' }, runningMode: 'VIDEO', numPoses: 1, minPoseDetectionConfidence: .55, minTrackingConfidence: .55 });
        }
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setActive(true); setState('calibrating'); frameRef.current = requestAnimationFrame(renderLoop);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Camera access was unavailable.'); setState('idle');
    } finally { setLoading(false); }
  };

  const stop = () => {
    cancelAnimationFrame(frameRef.current); streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null; setActive(false); setState('idle'); setScore(0);
    canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const calibrate = () => {
    const video = videoRef.current; const model = landmarkerRef.current;
    if (!video || !model) return;
    const points = model.detectForVideo(video, Math.max(performance.now(), lastInferenceRef.current + 1)).landmarks[0];
    if (!points) { setError('Sit fully in frame so I can see your head and shoulders.'); return; }
    const reference = scorePose(points, null).neckLength; baselineRef.current = reference; setBaseline(reference); setState('aligned'); setError('');
  };

  const message = state === 'slouching' ? 'Lift through the crown' : state === 'aligned' ? 'You’re stacked nicely' : state === 'searching' ? 'Come into frame' : state === 'calibrating' ? 'Sit tall, then set your baseline' : 'Your quiet posture companion';
  const detail = state === 'slouching' ? 'Ease your shoulders back and float your ears above them.' : state === 'aligned' ? 'Breathe, soften your jaw, and keep this easy shape.' : 'Your camera stays on this device. No photos are uploaded.';
  const average = snapshots.length ? Math.round(snapshots.reduce((sum, item) => sum + item.score, 0) / snapshots.length) : score;
  const mins = Math.floor(nextSnapshot / 60000); const secs = Math.floor((nextSnapshot % 60000) / 1000);

  return (
    <main className={`app posture-${state}`}>
      <header>
        <div className="wordmark"><span className="mark"><i /><i /><i /></span><div><b>UPRIGHT</b><small>POSTURE, FELT</small></div></div>
        <div className="privacy-row">
          <div className="privacy"><LockKeyhole size={14} /> PRIVATE BY DESIGN · ON-DEVICE AI</div>
          <div className={`sync-status ${isConfigured ? 'synced' : 'local'}`}>
            <span className="dot" />
            {isConfigured ? 'CONNECTED TO SUPABASE' : 'LOCAL-ONLY STORAGE'}
          </div>
        </div>
      </header>

      <section className="stage">
        <div className="camera-shell">
          <video ref={videoRef} muted playsInline />
          <canvas ref={canvasRef} />
          {!active && <div className="camera-empty"><div className="orb"><ScanFace size={48} /></div><p>Your posture appears here</p><span>Center your head and shoulders in frame</span></div>}
          <div className="scanline" />
          <div className="camera-label"><span className={active ? 'live' : ''} />{active ? 'ANALYZING LIVE' : 'CAMERA RESTING'}</div>
          {active && <div className="score-ring"><strong>{score || '—'}</strong><small>POSTURE</small></div>}
        </div>

        <div className="coach">
          <p className="eyebrow"><Sparkles size={14} /> LIVE COACH</p>
          <h1>{message}</h1>
          <p className="coach-copy">{detail}</p>
          <div className={`status status-${state}`}><span>{state === 'aligned' ? <Check size={17} /> : <Gauge size={17} />}</span><div><b>{state === 'slouching' ? 'Slouch detected' : state === 'aligned' ? 'Aligned posture' : 'Ready when you are'}</b><small>{baseline ? 'Compared with your personal tall baseline' : 'Calibrate once from a comfortable tall seat'}</small></div></div>
          <div className="actions">
            {!active ? <button className="primary" onClick={start} disabled={loading}><Camera size={19} />{loading ? 'WAKING THE COACH…' : 'START CAMERA'}</button> : <button className="primary" onClick={calibrate}><RotateCcw size={18} />SET TALL BASELINE</button>}
            {active && <button className="icon-button" onClick={stop} title="Pause camera"><Pause size={19} /></button>}
          </div>
          {error && <p className="error">{error}</p>}
          <p className="medical-note">A wellbeing cue, not a medical diagnosis. Pain or persistent symptoms deserve a qualified clinician.</p>
        </div>
      </section>

      <section className="lower">
        <div className="checkin card">
          <div className="section-title"><div><p className="eyebrow">HOW ARE YOU, REALLY?</p><h2>Quick check-in</h2></div><span>Slide what feels true</span></div>
          <Metric icon={<Gauge size={15} />} label="ENERGY" value={checkIn.energy} />
          <input aria-label="Energy" type="range" min="0" max="100" value={checkIn.energy} onChange={(e) => setCheckIn({ ...checkIn, energy: +e.target.value })} />
          <Metric icon={<Focus size={15} />} label="FOCUS" value={checkIn.focus} />
          <input aria-label="Focus" type="range" min="0" max="100" value={checkIn.focus} onChange={(e) => setCheckIn({ ...checkIn, focus: +e.target.value })} />
          <Metric icon={<Eye size={15} />} label="EYE STRAIN" value={checkIn.strain} />
          <input aria-label="Eye strain" type="range" min="0" max="100" value={checkIn.strain} onChange={(e) => setCheckIn({ ...checkIn, strain: +e.target.value })} />
        </div>

        <div className="rhythm card">
          <div className="section-title"><div><p className="eyebrow">YOUR WORK RHYTHM</p><h2>Posture moments</h2></div><button className="text-button" onClick={takeSnapshot} disabled={!active}>CAPTURE NOW</button></div>
          <div className="next"><div className="pulse"><Play size={16} /></div><div><small>NEXT PRIVATE CHECK</small><strong>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</strong></div><p>Every 15 min<br/><span>landmarks only</span></p></div>
          <div className="timeline">
            {snapshots.length === 0 ? <div className="empty-timeline"><i /><p>Your posture pattern will gently gather here.</p></div> : snapshots.slice(0, 5).map((item) => <div className="moment" key={item.id}><span className={item.score < 72 ? 'low' : ''}>{item.score}</span><div><b>{item.time}</b><small>{item.state === 'slouching' ? 'Rounded moment' : 'Open posture'} · energy {item.energy}% · focus {item.focus}%</small></div></div>)}
          </div>
          <div className="summary"><span>Today’s shape</span><b>{snapshots.length ? `${average}% aligned on average` : 'Waiting for your first moment'}</b></div>
        </div>
      </section>
    </main>
  );
}
