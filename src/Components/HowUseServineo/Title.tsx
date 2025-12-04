'use client';

import 'animate.css';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FaArrowDown } from 'react-icons/fa6';
import { Play } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
const subtitle =
  'Estos son los pasos que debe seguir para\npoder usar nuestra plataforma facilmente';

export const Title = () => {
  const [playing, setPlaying] = useState(false);
  const [audioAllowed, setAudioAllowed] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPauseScreen, setShowPauseScreen] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const [checkPause, setCheckPause] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAllowAudio = async () => {
    setAudioAllowed(true);
    setOpen(false);
  };

  const handleNoAudio = () => {
    setOpen(false);
    setAudioAllowed(false);
    setCheckPause(true);
  };

  const handlePlayPause = () => {
    if (audioAllowed === false) {
      if (checkPause === true) {
        setPlaying(!playing);
        setShowPauseScreen(!showPauseScreen);
      } else {
        setOpen(true);
      }
      //return;
    } else {
      //setAudioAllowed(!audioAllowed);
      setPlaying(!playing);
      setShowPauseScreen(!showPauseScreen);
    }
  };

  return (
    <div>
      <div className='flex flex-col items-center min-h-screen gap-[10px] bg-gradient-to-b from-[#2B6AE0] to-[#2B31E0]'>
        <div>
          <h1 className='text-center text-[60px] text-white mt-[40px]'> Cómo funciona Servineo </h1>
        </div>

        <div>
          <h3 className='text-white mb-[24px] whitespace-pre-line'> {subtitle} </h3>
        </div>

        {/*popover*/}
        <Popover.Root open={open}>
          <Popover.Trigger asChild>
            <button>{audioAllowed ? '' : ''}</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content className='bg-white p-4 rounded-xl shadow-md max-w-sm text-center w-auto h-auto animate__animated animate__fadeInDown'>
              <p className='mb-2 font-semibold'>¿Deseas activar el sonido?</p>
              <p className='text-sm text-gray-500 mb-3'>
                Activa el sonido para una mejor experiencia visual y auditiva.
              </p>
              <div className='flex justify-center gap-2'>
                <button
                  className='cursor-pointer gap-[3px] bg-[#2B6EA0] hover:bg-[#2B31E0] duration-150 text-white h-9 w-40 rounded-[8px]'
                  onClick={handleAllowAudio}
                >
                  Sí, activar
                </button>
                <button
                  className='cursor-pointer gap-[3px] bg-[#2B6EA0] hover:bg-[#2B31E0] duration-150 text-white h-9 w-40 rounded-[8px]'
                  onClick={handleNoAudio}
                >
                  No
                </button>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        {/* */}

        {/* contenedor del video */}
        <div className='relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden shadow-lg mb-[30px]'>
          {isClient && (
            <ReactPlayer
              src='/videos/SERVINEO_TUTORIAL.mp4'
              playing={playing}
              muted={audioAllowed ? false : true}
              controls
              height='100%'
              width='100%'
              style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
            />
          )}

          {showPauseScreen === true && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity duration-300'>
              <button>
                <Play
                  onClick={handlePlayPause}
                  className='cursor-pointer text-white drop-shadow-lg transition-transform duration-300 hover:scale-130'
                  size={64}
                  color='white'
                />
              </button>
            </div>
          )}
        </div>
        {/* */}
        <div className='flex flex-col items-center mb-[30px] text-[25px] gap-[10px]'>
          <span className='text-white'> Descúbrelo </span>
          <FaArrowDown
            className='animate__animated animate__shakeY animate__slower animate__infinite'
            color='white'
          />
        </div>
      </div>
    </div>
  );
};
