import { Camera } from '@/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CameraListProps {
  cameras: Camera[];
}

export default function CameraList({ cameras }: CameraListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cameras.map((camera) => (
        <motion.div key={camera.id} variants={itemVariants}>
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{camera.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground truncate">{camera.rtsp_url}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {camera.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/cameras/${camera.id}`} className='w-full'>
                <Button variant="outline" className='w-full'>View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
