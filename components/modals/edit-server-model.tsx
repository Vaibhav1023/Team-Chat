"use client";
import * as z from "zod";
import  axios  from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription,
    DialogFooter, 
    DialogHeader,
    DialogTitle 
} from "../ui/dialog";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { FileUpload } from "../file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name required*"
    }),
    imageUrl: z.string().min(1, {
        message: "Image URL is required."
    })
});

export const EditServerModel = () => {

const {isOpen, onClose, type, data} = useModal()
const router = useRouter();

const isModelOpen = isOpen && type === "editServer"
const {server} = data;

const form = useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
        name: "",
        imageUrl: "",
    }
});

useEffect(() => {
    if(server){
        form.setValue("name", server.name);
        form.setValue("imageUrl", server.imageUrl);
    }
}, [server, form])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/servers/${server?.id}`, values);
            form.reset()
            router.refresh();
            onClose();
            
        }catch(error){
            console.log(error);
        }
        
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }


    return (
        <div>
        <Dialog open={isModelOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-stone-900 text-white p-0 overflow-hidden">
                <DialogHeader className="py-7 px-5">
                    <DialogTitle className="text-2xl text-center font-normal">
                        Edit your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-400">
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-5 px-6">
                            <div className="flex items-center justify-center">
                                <FormField 
                                        control={form.control}
                                        name="imageUrl"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <FileUpload
                                                        endpoint="serverImage"
                                                        value = {field.value}
                                                        onChange = {field.onChange}
                                                        />
                                                </FormControl>
                                            </FormItem>
                                        )}>

                                </FormField>
                            </div>
                            <FormField 
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel 
                                            className="uppercase text-xs font-bold text-white">
                                                Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={isLoading} 
                                                className="bg-white border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter Your Server" 
                                                {...field}
                                                >
                                                
                                            </Input>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />
                        </div>
                        <DialogFooter className="bg-stone-600 px-6 py-2">
                            <Button disabled={isLoading}
                                    variant={"primary"}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
        </div>
    )
}