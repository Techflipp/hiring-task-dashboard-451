// components/analytics/AnalyticsFilter.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { filterSchema, type FilterForm } from '@/lib/validators/analyticsFilterSchema';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/Select';

type Props = {
  camera_id: string;
  onSubmit: (filters: FilterForm) => void;
};

export const AnalyticsFilter = ({ camera_id, onSubmit }: Props) => {
  const form = useForm<FilterForm>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      camera_id,
    },
  });

  const { register, handleSubmit, setValue, reset } = form;

  const handleReset = () => {
    reset({ camera_id });
    onSubmit({ camera_id });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div>
        <Label>Gender</Label>
        <Select onValueChange={(val) => setValue('gender', val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Age</Label>
        <Input {...register('age')} placeholder="e.g. 25" />
      </div>

      <div>
        <Label>Emotion</Label>
        <Input {...register('emotion')} placeholder="e.g. happy" />
      </div>

      <div>
        <Label>Ethnicity</Label>
        <Input {...register('ethnicity')} placeholder="e.g. asian" />
      </div>

      <div>
        <Label>Start Date</Label>
        <Input type="date" {...register('start_date')} />
      </div>

      <div>
        <Label>End Date</Label>
        <Input type="date" {...register('end_date')} />
      </div>

      <div className="col-span-full flex gap-2">
        <Button type="submit">Apply Filters</Button>
        <Button type="button" variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  );
};
