



const getInitials = (name) => {
    if(!name) return "?";
    const words = name.trim().split(" ");
    if(words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

const getColors = (name) => {
    const bgColors = [
        "bg-red-300",
        "bg-blue-300",
        "bg-green-300",
        "bg-yellow-300",
        "bg-purple-300",
        "bg-pink-300",
        "bg-indigo-300"
    ];
    const textColors = [
        "text-red-500",
        "text-blue-500",
        "text-green-500",
        "text-yellow-500",
        "text-purple-500",
        "text-pink-500",
        "text-indigo-500"
    ];
    let hash = 0;
    for(let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const bgColor = bgColors[Math.abs(hash) % bgColors.length]
    const textColor = textColors[Math.abs(hash) % textColors.length]
    return {bgColor,textColor};
};

function Avatar({name}) {
    const initials = getInitials(name);
    const {bgColor, textColor} = getColors(name || "");
    // const color = getColors(name || "");

    return (
        <div title={name} className={`${bgColor} ${textColor} w-10 h-10 flex items-center justify-center rounded-full font-bold cursor-pointer`}>
            {initials}
        </div>
    )
}


export default Avatar;