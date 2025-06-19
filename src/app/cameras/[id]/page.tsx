import { CameraDetail } from '@/components/camera/CameraDetail'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CameraDetailPage({ params }: Props) {
  const { id } =await params

  return <CameraDetail id={id} />
}
