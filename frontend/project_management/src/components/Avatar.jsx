const getInitials = (name) => {
    if(!name) return "?";
    const words = name.trim().split(" ");
    if(words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

function Avatar({name}) {
    const initials = getInitials(name);

    return (
        <div title={name} className="bg-enterprise-muted text-white w-8 h-8 flex items-center justify-center rounded-md font-bold cursor-pointer shadow-sm border border-white/10 transition-colors hover:bg-enterprise-dark">
            {initials}
        </div>
    )
}


export default Avatar;