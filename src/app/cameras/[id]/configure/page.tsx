import { DemographicsConfigForm } from "@/components/camera/DemographicConfigForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ConfigureCameraPage({ params }: Props) {
    const {id} = await params
  return <DemographicsConfigForm id={id} />;
}
