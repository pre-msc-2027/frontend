import React from 'react';

const LogsDashboard: React.FC = () => {
    return (
        <div
            className="w-full h-full flex flex-col justify-center items-center rounded-lg bg-bgsecondary p-4 overflow-hidden">
            <div className="w-full h-1/6 flex flex-col lg:flex-col lg:items-center">
                {/*Search Bar*/}
                <div className="w-full flex justify-center mb-4 lg:mb-2">
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="p-2 rounded-lg text-textg focus:outline-none w-full bg-bg"
                    />
                </div>
                {/*Tags*/}
                <div className="w-full flex flex-row gap-2 justify-evenly lg:justify-center m-2 bg-bgsecondary">
                    <div className="gap-2 flex items-center">
                        <input type="checkbox" id="debug" name="debug"/>
                        <label htmlFor="debug">Debug</label>
                    </div>
                    <div className="gap-2 flex items-center">
                        <input type="checkbox" id="warning" name="warning"/>
                        <label htmlFor="warning">Warning</label>
                    </div>
                    <div className="gap-2 flex items-center">
                        <input type="checkbox" id="error" name="error"/>
                        <label htmlFor="error">Error</label>
                    </div>
                    <div className="gap-2 flex items-center">
                        <input type="checkbox" id="info" name="info"/>
                        <label htmlFor="info">Info</label>
                    </div>
                </div>
            </div>
            {/*Logs Table*/}
            <div className="w-full uppercase bg-bgsecondary flex">
                <div className="px-6 py-3 flex-1">Timestamp</div>
                <div className="px-6 py-3 flex-1">Level</div>
                <div className="px-6 py-3 flex-1">Message</div>
            </div>
            <div className="w-full overflow-y-auto h-5/6 bg-bgsecondary rounded-lg p-4">
                <table className="w-full text-left text-sm text-gray-400">
                    <tbody>
                    <tr className="border-b border-gray-700 hover:text-primary">
                        <td className="px-6 py-4 ">2023-10-01 12:00:00</td>
                        <td className="px-6 py-4">Info</td>
                        <td className="px-6 py-4">Application started successfully.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:text-primary">
                        <td className="px-6 py-4">2023-10-01 12:05:00</td>
                        <td className="px-6 py-4">Warning</td>
                        <td className="px-6 py-4">Low disk space on server.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:text-primary">
                        <td className="px-6 py-4">2023-10-01 12:10:00</td>
                        <td className="px-6 py-4">Error</td>
                        <td className="px-6 py-4">Failed to connect to database.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:text-primary">
                        <td className="px-6 py-4">2023-10-01 12:00:00</td>
                        <td className="px-6 py-4">Info</td>
                        <td className="px-6 py-4">Application started successfully.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:text-primary">
                        <td className="px-6 py-4">2023-10-01 12:05:00</td>
                        <td className="px-6 py-4">Warning</td>
                        <td className="px-6 py-4">Low disk space on server.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:text-primary">
                        <td className="px-6 py-4">2023-10-01 12:10:00</td>
                        <td className="px-6 py-4">Error</td>
                        <td className="px-6 py-4">Failed to connect to database.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:text-primary">
                        <td className="px-6 py-4">2023-10-01 12:00:00</td>
                        <td className="px-6 py-4">Info</td>
                        <td className="px-6 py-4">Application started successfully.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:text-primary">
                        <td className="px-6 py-4">2023-10-01 12:05:00</td>
                        <td className="px-6 py-4">Warning</td>
                        <td className="px-6 py-4">Low disk space on server.</td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:text-primary">
                        <td className="px-6 py-4">2023-10-01 12:10:00</td>
                        <td className="px-6 py-4">Error</td>
                        <td className="px-6 py-4">Failed to connect to database.</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogsDashboard;
