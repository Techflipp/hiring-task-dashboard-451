import { DemographicsConfig } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ConfigStatusProps {
  cameraId: string;
  config?: DemographicsConfig;
}

export function ConfigStatus({ cameraId, config }: ConfigStatusProps) {
  const hasConfig = !!config;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {hasConfig ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-gray-400" />
            )}
            <div>
              <h3 className="font-medium text-gray-900">
                Demographics Configuration
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {hasConfig
                  ? "Active configuration found"
                  : "No configuration set up"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant={hasConfig ? "success" : "default"}>
              {hasConfig ? "Configured" : "Not Configured"}
            </Badge>
            <Link href={`/cameras/${cameraId}/demographics`}>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                {hasConfig ? "Edit" : "Configure"}
              </Button>
            </Link>
          </div>
        </div>

        {hasConfig && config && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Detection Confidence:</span>
                <p className="font-medium">
                  {config.detection_confidence_threshold || "Default"}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Min Track Duration:</span>
                <p className="font-medium">
                  {config.min_track_duration || "Default"}s
                </p>
              </div>
              <div>
                <span className="text-gray-600">Save Interval:</span>
                <p className="font-medium">
                  {config.save_interval || "Default"}s
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
