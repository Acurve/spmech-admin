const CardLoader = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {
                [1, 2, 3].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                        <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                    </div>
                ))
            }
        </div>
    )
}

export default CardLoader