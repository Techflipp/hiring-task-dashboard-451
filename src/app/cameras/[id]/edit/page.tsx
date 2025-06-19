import { CameraEditForm } from '@/components/camera/CameraEditForm'

interface Props {
  params: { id: string }
}

export default function EditCameraPage({ params }: Props) {
  return <CameraEditForm id={params.id} />
}
