import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faSearch, faUserPlus, faUser } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { toast } from 'react-hot-toast'

function AddMemberModal({ workspace, onClose, onMemberAdded }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [isAdding, setIsAdding] = useState(false)

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.length > 2) {
                searchUsers()
            } else {
                setResults([])
            }
        }, 300)

        return () => clearTimeout(delayDebounce)
    }, [query])

    const searchUsers = async () => {
        setIsSearching(true)
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${import.meta.env.VITE_API_URL || 'https://project-management-8lud.onrender.com'}/api/auth/search-users?query=${query}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setResults(response.data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsSearching(false)
        }
    }

    const addMember = async (user) => {
        setIsAdding(true)
        try {
            const token = localStorage.getItem("token")
            await axios.post(`${import.meta.env.VITE_API_URL || 'https://project-management-8lud.onrender.com'}/api/workspaces/${workspace.id}/members`, {
                user_id: user.id,
                role: 'member'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(`${user.name} added to workspace`)
            if (onMemberAdded) onMemberAdded()
            onClose()
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add member')
        } finally {
            setIsAdding(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-enterprise-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden border border-enterprise-muted/20 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-enterprise-muted/10 bg-enterprise-light/50">
                    <h2 className="text-sm font-bold text-enterprise-dark uppercase tracking-widest">Provision User Access</h2>
                    <button onClick={onClose} className="text-enterprise-muted hover:text-enterprise-dark transition-colors"><FontAwesomeIcon icon={faXmark} /></button>
                </div>

                <div className="p-6">
                    <p className="text-[10px] font-bold text-enterprise-muted uppercase tracking-widest mb-4">Search Personnel by Institutional Email</p>
                    
                    <div className="relative mb-6">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-enterprise-muted text-xs" />
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter email address..." 
                            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-enterprise-muted/30 rounded focus:ring-1 focus:ring-enterprise-dark outline-none transition-all font-semibold"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2 min-h-[200px]">
                        {isSearching ? (
                            <div className="flex justify-center py-8">
                                <div className="w-5 h-5 border-2 border-enterprise-dark border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : results.length > 0 ? (
                            results.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-3 rounded border border-enterprise-muted/10 bg-enterprise-light/30 hover:bg-white hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-enterprise-muted rounded flex items-center justify-center text-white text-[10px] font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-enterprise-dark">{user.name}</p>
                                            <p className="text-[10px] text-enterprise-muted">{user.email}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => addMember(user)}
                                        disabled={isAdding}
                                        className="px-3 py-1 bg-enterprise-dark text-white text-[9px] font-bold uppercase tracking-widest rounded hover:bg-enterprise-accent transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))
                        ) : query.length > 2 ? (
                            <div className="text-center py-8 opacity-40">
                                <FontAwesomeIcon icon={faUser} className="text-2xl mb-2" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">No matching personnel found</p>
                            </div>
                        ) : (
                            <div className="text-center py-8 opacity-20">
                                <FontAwesomeIcon icon={faUserPlus} className="text-3xl mb-2" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting input</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 bg-enterprise-light/30 border-t border-enterprise-muted/10">
                    <button onClick={onClose} className="w-full py-2 border border-enterprise-muted/30 text-enterprise-muted font-bold uppercase text-[10px] tracking-widest rounded hover:bg-white transition-all">Close</button>
                </div>
            </div>
        </div>
    )
}

export default AddMemberModal
