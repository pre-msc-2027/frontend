import React from "react";

const data = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
    { id: 4, name: "Item 4" },
    { id: 5, name: "Item 1" },
    { id: 6, name: "Item 2" },
    { id: 7, name: "Item 3" },
    { id: 8, name: "Item 4" },
    { id: 9, name: "Item 1" },
    { id: 10, name: "Item 2" },
    { id: 11, name: "Item 3" },
    { id: 12, name: "Item 4" },
    { id: 13, name: "Item 1" },
    { id: 14, name: "Item 2" },
    { id: 15, name: "Item 3" },
    { id: 16, name: "Item 4" },
];

const RulesCard: React.FC = () => {
    const [selectedItems, setSelectedItems] = React.useState<number[]>([]);

    const handleCheckboxChange = (id: number) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="relative w-full h-full rounded-lg p-4 bg-bgsecondary flex items-center justify-center">
            {/* Table centrée verticalement */}
            <div className="w-full max-h-84 overflow-y-auto flex justify-center">
                <table className="table-auto w-1/2">
                    <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="border-b border-gray-300 text-text flex justify-center">
                            <td className="px-4 py-2 text-center">
                                <input
                                    type="checkbox"
                                    className="scale-100"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleCheckboxChange(item.id)}
                                />
                            </td>
                            <td className="px-4 py-2 text-center">{item.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <h2 className="absolute bottom-4 left-4 text-xl text-text">Selected Rules</h2>
        </div>
    );



};
export default RulesCard;