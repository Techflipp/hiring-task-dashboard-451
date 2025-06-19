import { CameraEditForm } from '@/components/camera/CameraEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCameraPage({ params }: Props) {
    const {id} = await params
  return <CameraEditForm id={id} />
}
