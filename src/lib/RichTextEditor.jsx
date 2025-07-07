'use client';
import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
// import 'jodit/build/jodit.min.css';

const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
});

const RichTextEditor = ({ value, onChange }) => {
  const editor = useRef(null);

  return (
    <div className="w-full">
      <JoditEditor
        ref={editor}
        value={value}
        onBlur={onChange}
        config={{
          readonly: false,
          height: 300,
          toolbarSticky: false,
        }}
      />
    </div>
  );
};

export default RichTextEditor;
