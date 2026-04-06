import React, {useEffect, useState} from 'react';
import getWorkspace from '../utils/getWorkspace';

function CreateWorkspaceModal({createWorkspace,onClose}){
    const [name,setName] = useState("");
    const handleSubmit = async(e) => {
        e.preventDefault();

        await createWorkspace(
            {name}
        );
        setName("");
        onClose();
    } ;
    return (
        <div className='fixed inset-0 bg-black/30 flex items-center justify-center'>
            <div className='bg-white p-5 rounded-lg w-[300px]'>
                <h2 className='text-lg font-bold mb-3'>Create Workspace</h2>
                <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                    <input 
                    type="text"
                    placeholder='Workspace Name'
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

export default CreateWorkspaceModal