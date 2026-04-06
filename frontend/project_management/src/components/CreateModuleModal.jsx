import React, {useEffect, useState} from 'react';
import getWorkspace from '../utils/getWorkspace';

function CreateModuleModal({createModule,selectedWorkspace,selectedProject,onClose}){
    const [name,setName] = useState("");
    const handleSubmit = async(e) => {
        e.preventDefault();

        await createModule(
            {name,workspace_id: selectedWorkspace.id,project_id: selectedProject.id}
        );
        setName("");
        onClose();
    } ;
    return (
        <div className='fixed z-50 inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center'>
            <div className='bg-white p-5 rounded-lg w-[300px]'>
                <h2 className='text-lg font-bold mb-3'>Create Module</h2>
                <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                    <input 
                    type="text"
                    placeholder='Module Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='border p-2 rounded'
                    required
                    />
                    <div className='flex justify-end gap-2'>
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button className='bg-blue-500 text-white px-3 py-1 rounded'>Create</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateModuleModal;