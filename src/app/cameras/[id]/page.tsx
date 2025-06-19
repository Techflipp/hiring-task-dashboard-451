import { CameraDetail } from '@/components/camera/CameraDetail'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default async function CameraDetailPage({ params }: Props) {
  const { id } = params

  return <CameraDetail id={id} />
}
