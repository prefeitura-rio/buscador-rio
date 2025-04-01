"use client"

import React, { useEffect, useState } from 'react';
import useNetwork from '@/hooks/useNetwork';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
// import Image from 'next/image';

const NetworkStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const isOnline = useNetwork();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      // console.log("Offline now");
      setShowAlert(true);
    } else {
      if (showAlert) {
        toast.success("Sua conexão com a internet foi restaurada.");
      }
      setShowAlert(false);
    }
  }, [isOnline, showAlert]);

  return (
    <main>
      {children}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogTrigger asChild>
          <button className="hidden">Trigger</button>
        </AlertDialogTrigger>
        <AlertDialogContent className="text-center">
          <AlertDialogTitle>Sem Internet</AlertDialogTitle>
          <AlertDialogDescription>
            Você está offline. Por favor, verifique sua conexão com a internet.
          </AlertDialogDescription>
          {/* <div className="flex justify-center items-center pt-2">
            <Image
              src="/iplan-animated-logo.gif"
              width={100}  
              height={20} 
              alt=""
              unoptimized // Required for GIFs in Next.js Image component
            />
          </div> */}
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

export default NetworkStatusProvider;