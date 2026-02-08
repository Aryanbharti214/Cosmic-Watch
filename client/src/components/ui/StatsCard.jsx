import CountUp from "react-countup"

export default function StatsCard({ title, value, color }) {
  return (
    <div className="bg-black/40 backdrop-blur-xl p-6 rounded-xl border border-purple-800 hover:scale-105 transition-all">

      <h3 className="text-gray-400 text-sm">{title}</h3>

      <div className={`text-3xl font-bold mt-2 ${color}`}>
        <CountUp end={value} duration={2} />
      </div>

    </div>
  )
}
