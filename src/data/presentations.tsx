
import { Brain, Network, Cpu, Zap, Target } from 'lucide-react';

export const presentations: Record<string, any> = {
  "neural-networks": {
    title: "Как работают нейронные сети",
    description: "Простое введение в сложную технологию",
    slides: [
      {
        id: 1,
        title: "Как работают нейронные сети",
        subtitle: "Простое введение в сложную технологию",
        icon: <Brain className="w-24 h-24 text-blue-400 mb-6 animate-pulse" />,
        content: (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
              Нейронные сети — это вычислительные модели, вдохновленные биологическим мозгом. Они способны обучаться на примерах и находить скрытые закономерности в данных.
            </p>
          </div>
        )
      },
      {
        id: 2,
        title: "Базовая структура",
        subtitle: "Из чего состоит нейросеть?",
        icon: <Network className="w-12 h-12 text-purple-400 mb-4" />,
        content: (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex space-x-12 items-center w-full max-w-3xl justify-center mb-8">
              <div className="flex flex-col items-center relative group">
                <div className="text-sm font-bold text-green-400 mb-4">Входной слой</div>
                <div className="flex flex-col space-y-3">
                  {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] flex items-center justify-center text-xs text-green-300">X{i}</div>)}
                </div>
                <div className="absolute -bottom-10 text-xs text-gray-400 w-32 text-center opacity-0 group-hover:opacity-100 transition-opacity">Исходные данные</div>
              </div>

              <div className="h-0.5 w-16 bg-gradient-to-r from-green-500 to-blue-500 opacity-50"></div>

              <div className="flex flex-col items-center relative group">
                <div className="text-sm font-bold text-blue-400 mb-4">Скрытые слои</div>
                <div className="flex space-x-6">
                  <div className="flex flex-col space-y-3">
                    {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full bg-blue-500/20 border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center justify-center"></div>)}
                  </div>
                </div>
                <div className="absolute -bottom-10 text-xs text-gray-400 w-32 text-center opacity-0 group-hover:opacity-100 transition-opacity">Обработка</div>
              </div>

              <div className="h-0.5 w-16 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50"></div>

              <div className="flex flex-col items-center relative group">
                <div className="text-sm font-bold text-purple-400 mb-4">Выходной слой</div>
                <div className="flex flex-col space-y-3">
                  {[1,2].map(i => <div key={i} className="w-10 h-10 rounded-full bg-purple-500/20 border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center text-xs text-purple-300">Y{i}</div>)}
                </div>
                <div className="absolute -bottom-10 text-xs text-gray-400 w-32 text-center opacity-0 group-hover:opacity-100 transition-opacity">Результат</div>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 3,
        title: "Искусственный нейрон",
        subtitle: "Как работает один элемент сети?",
        icon: <Cpu className="w-12 h-12 text-yellow-400 mb-4" />,
        content: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl items-center">
            <div className="space-y-4 text-left">
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <h4 className="text-yellow-400 font-bold mb-1 flex items-center">Входы и Веса</h4>
                <p className="text-sm text-gray-300">Данные умножаются на «веса» (важность) и суммируются.</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <h4 className="text-yellow-400 font-bold mb-1 flex items-center">Смещение (Bias)</h4>
                <p className="text-sm text-gray-300">Добавочное число, которое сдвигает результат.</p>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <h4 className="text-yellow-400 font-bold mb-1 flex items-center">Функция активации</h4>
                <p className="text-sm text-gray-300">Решает: "включится" ли нейрон и передаст ли сигнал дальше.</p>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center relative h-64 bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.1)_0%,transparent_70%))]"></div>
              <div className="text-sm text-gray-400 mb-2 z-10 font-mono">Формула нейрона:</div>
              <div className="text-2xl font-mono text-yellow-400 z-10 px-4 text-center">
                y = f(Σ(x × w) + b)
              </div>
            </div>
          </div>
        )
      },
      {
        id: 4,
        title: "Процесс обучения",
        subtitle: "Как сеть становится умнее?",
        icon: <Zap className="w-12 h-12 text-pink-400 mb-4" />,
        content: (
          <div className="w-full max-w-4xl flex flex-col space-y-4">
            <div className="flex items-start space-x-4 bg-gray-800/40 p-5 rounded-xl border-l-4 border-pink-500">
              <div className="text-pink-400 font-mono font-bold text-xl mt-1">01</div>
              <div>
                <h4 className="text-white font-bold mb-1">Прямое распространение</h4>
                <p className="text-gray-400 text-sm">Данные проходят через сеть. Сеть угадывает ответ.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 bg-gray-800/40 p-5 rounded-xl border-l-4 border-pink-500">
              <div className="text-pink-400 font-mono font-bold text-xl mt-1">02</div>
              <div>
                <h4 className="text-white font-bold mb-1">Вычисление ошибки</h4>
                <p className="text-gray-400 text-sm">Вычисляется размер "штрафа" за ошибку.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 bg-gray-800/40 p-5 rounded-xl border-l-4 border-pink-500">
              <div className="text-pink-400 font-mono font-bold text-xl mt-1">03</div>
              <div>
                <h4 className="text-white font-bold mb-1">Обратное распространение</h4>
                <p className="text-gray-400 text-sm">Сеть идет назад и меняет "веса", чтобы уменьшить ошибку.</p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 5,
        title: "Что умеют нейросети?",
        subtitle: "Сферы применения",
        icon: <Target className="w-12 h-12 text-cyan-400 mb-4" />,
        content: (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
            {[
              { title: "Компьютерное зрение", desc: "Распознавание лиц", emoji: "👁️" },
              { title: "NLP", desc: "ChatGPT, код, перевод", emoji: "📝" },
              { title: "Медиа", desc: "Midjourney, DALL-E", emoji: "🎨" },
              { title: "Рекомендации", desc: "YouTube, Netflix", emoji: "🎯" },
              { title: "Анализ звука", desc: "Siri, Алиса", emoji: "🎙️" },
              { title: "Робототехника", desc: "Дроны, автопилоты", emoji: "🤖" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800/40 p-5 rounded-xl border border-gray-700">
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h4 className="text-cyan-400 font-bold mb-2 text-sm">{item.title}</h4>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        )
      }
    ]
  }
};
