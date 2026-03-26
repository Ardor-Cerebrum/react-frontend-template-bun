
import { BrowserRouter, Routes, Route, useParams, Link } from 'react-router-dom';
import PresentationViewer from './components/PresentationViewer';
import { presentations } from './data/presentations';

function PresentationRoute() {
  const { id } = useParams();
  const presentation = id ? presentations[id] : null;

  if (!presentation) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white">
        <h1 className="text-4xl font-bold mb-4">Презентация не найдена</h1>
        <Link to="/" className="text-blue-400 hover:text-blue-300">На главную</Link>
      </div>
    );
  }

  return <PresentationViewer presentation={presentation} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/p/:id" element={<PresentationRoute />} />
        <Route path="/" element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-6">
            <div className="max-w-4xl w-full">
              <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Платформа презентаций</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(presentations).map(([key, p]: [string, any]) => (
                  <Link key={key} to={`/p/${key}`} className="p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500/50 hover:bg-gray-800/80 transition-all group">
                    <h2 className="text-2xl font-bold text-gray-100 group-hover:text-blue-400 transition-colors">{p.title}</h2>
                    <p className="text-gray-400 mt-3 line-clamp-2">{p.description}</p>
                    <div className="mt-6 flex items-center text-sm font-medium text-blue-500">
                      Смотреть <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
