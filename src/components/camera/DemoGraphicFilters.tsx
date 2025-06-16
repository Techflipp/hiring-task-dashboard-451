"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Filter, RefreshCw } from "lucide-react";
import {
  AgeEnum,
  EmotionEnum,
  EthnicGroupEnum,
  GenderEnum,
} from "@/constants/apitypes";

const AgeEnumItems = ["0-18", "19-30", "31-45", "46-60", "60+"] as const;

const EmotionEnumItems = [
  "angry",
  "fear",
  "happy",
  "neutral",
  "sad",
  "surprise",
] as const;

const EthnicGroupEnumItems = [
  "white",
  "african",
  "south_asian",
  "east_asian",
  "middle_eastern",
] as const;

const GenderEnumItems = ["male", "female"] as const;

const FormSchema = z.object({
  age: z.enum(AgeEnumItems).or(z.literal("")).optional(),
  gender: z.enum(GenderEnumItems).or(z.literal("")).optional(),
  group: z.enum(EthnicGroupEnumItems).or(z.literal("")).optional(),
  emotion: z.enum(EmotionEnumItems).or(z.literal("")).optional(),
});

export default function DemoGraphicsFilters() {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  //to make sure the params and the form are synced
  const defaultValues = {
    age: (searchParams.get("age") as AgeEnum) || "",
    gender: (searchParams.get("gender") as GenderEnum) || "",
    emotion: (searchParams.get("emotion") as EmotionEnum) || "",
    group: (searchParams.get("group") as EthnicGroupEnum) || "",
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const params = new URLSearchParams(searchParams);
    params.set("gender", data.gender || "");
    params.set("age", data.age || "");
    params.set("emotion", data.emotion || "");
    params.set("group", data.group || "");
    replace(`${pathname}?${params.toString()}`);
  }

  //resetting the form
  function formReset() {
    const params = new URLSearchParams(searchParams);
    params.delete("gender");
    params.delete("age");
    params.delete("emotion");
    params.delete("group");
    replace(`${pathname}?${params.toString()}`);
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-card border-border grid w-full grid-cols-2 gap-4 rounded-2xl border-1 p-2 xl:flex-row"
      >
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Age" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AgeEnumItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {GenderEnumItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="group"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EthnicGroupEnumItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emotion"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Emotion" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EmotionEnumItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          <Filter />
          Filter
        </Button>
        <Button
          variant={"secondary"}
          type="button"
          className="w-full"
          onClick={() => formReset()}
        >
          <RefreshCw />
        </Button>
      </form>
    </Form>
  );
}
