import {Box, Typography} from '@mui/material';
import {Flex} from "@/modules/cameras/camera-list/components/flex";

export default function Header({ cameraName }: { cameraName?: string }) {

    return (
       <Flex justifySelf={'center'}>
           <Typography variant="h4" gutterBottom className="text-center border font-extrabold w-fit border-gray-200 p-4 rounded-xl ">
               Demographics Results for Camera
               {cameraName && (
                   <span className="text-blue-800 font-semibold"> : {cameraName}</span>
               )}
           </Typography>
       </Flex>
    );
}
