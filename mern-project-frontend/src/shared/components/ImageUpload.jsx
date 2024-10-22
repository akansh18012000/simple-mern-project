import React, {useRef, useState, useEffect} from 'react';

const ImageUpload = (props) => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState('')
    const pickImageRef = useRef();

    const pickImageHandler = () => {
        pickImageRef.current.click()
    }

    useEffect(() => {
        if(file) {
            const fileReader = new FileReader();
            // Fired when a read has completed successfully.
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result)
            };
            // Starts reading the contents of the specified File, once finished, the result attribute contains a Url in the form of data: URL representing the file's data.
            fileReader.readAsDataURL(file);
        }
    }, [file])


    const uploadImageHandler = (event) => {
        let pickedfile;
        if(event.target.files && event.target.files.length === 1) {
            pickedfile = event.target.files[0];
            setFile(pickedfile)
            props?.onInputChange({
                [`${props.id}`]: pickedfile 
            })
        }
    }

    return (
        <div>
            <input type="file" className='hidden' id={props?.id} accept='.jpg,.png,.jpeg' ref={pickImageRef} onChange={uploadImageHandler}/>
            <div className='border h-[400px]'>
                {previewUrl ? <img src={previewUrl} alt="Preview" className='h-full'/> : <p>Please Pick an Image</p>}
            </div>
            <button type='button' className='border rounded-sm text-white bg-black p-2 mt-4 w-full' onClick={pickImageHandler}>Pick Image</button>
        </div>
    )
}

export default ImageUpload;