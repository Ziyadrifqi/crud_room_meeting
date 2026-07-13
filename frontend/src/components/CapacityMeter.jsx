export default function CapacityMeter({ capacity, participantCount }) {
  if (!capacity) return null;

  const count = Number(participantCount) || 0;
  const ratio = Math.min(count / capacity, 1);
  const over = count > capacity;

  return (
    <div className="capacity-meter">
      <div className="capacity-meter-track">
        <div
          className={`capacity-meter-fill${over ? ' over' : ''}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <div className="capacity-meter-label">
        <span>{count} peserta</span>
        <span>{over ? `Melebihi kapasitas (${capacity})` : `Kapasitas ${capacity}`}</span>
      </div>
    </div>
  );
}
