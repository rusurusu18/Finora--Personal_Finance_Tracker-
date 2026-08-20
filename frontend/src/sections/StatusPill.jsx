import Badge from '../ui/Badge'

export default function StatusPill({ progress }) {
  if (progress >= 100) return <Badge tone="danger">Over budget</Badge>
  if (progress >= 80) return <Badge tone="warning">Watch</Badge>
  return <Badge tone="success">On track</Badge>
}
