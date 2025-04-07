function Alert({ message, type = 'info', onClose }) {
    const bgColor =
        type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';

    return (
        <div
            className={`${bgColor} p-4 rounded-lg flex justify-between items-center max-w-md mx-auto mt-4 shadow-md`}
        >
            <span>{message}</span>
            {onClose && (
                <button onClick={onClose} className="text-xl font-bold">
                    &times;
                </button>
            )}
        </div>
    );
}

export default Alert;