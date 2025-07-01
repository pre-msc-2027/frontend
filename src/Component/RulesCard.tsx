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
        <div
            className="lg:w-full lg:h-full flex justify-center items-center rounded-lg p-4 overflow-hidden flex-col bg-bgsecondary">
            <h2 className="text-xl text-text p-4">Selected Rules</h2>
            <div className="w-full max-h-64 overflow-y-auto">
                <table className="table-auto w-full">
                    <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="border-b border-gray-300 text-text">
                            <td className="px-4 py-2 text-center ">
                                <input
                                    type="checkbox"
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
        </div>
    );
};
export default RulesCard;