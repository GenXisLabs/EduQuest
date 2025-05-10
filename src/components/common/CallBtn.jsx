import React, { useState } from 'react';

const CallBtn = ({ path, method, data={}, callback, className, text="Submit", confirmation=false }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        if (confirmation) {
            const userConfirmed = window.confirm('Are you sure you want to proceed?');
            if (!userConfirmed) {
                return;
            }
        }

        setIsLoading(true);
        try {
            const response = await fetch(path, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                callback(true, result); // Success callback
            } else {
                alert(result.message || 'An error occurred. Please try again.');
                callback(false, null); // Failure callback
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while processing your request.');
            callback(false, null); // Failure callback
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleClick} disabled={isLoading} className={className} style={{ position: 'relative' }}>
            {isLoading ? (
                <div className="spinner" style={{ marginRight: '8px' }}>
                    <div className="double-bounce1"></div>
                    <div className="double-bounce2"></div>
                </div>
            ) : (
                text
            )}
            <style jsx>{`
                .spinner {
                    width: 20px;
                    height: 20px;
                    position: relative;
                    display: inline-block;
                }
                .double-bounce1,
                .double-bounce2 {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: #ffffff;
                    opacity: 0.6;
                    position: absolute;
                    top: 0;
                    left: 0;
                    animation: bounce 2s infinite ease-in-out;
                }
                .double-bounce2 {
                    animation-delay: -1s;
                }
                @keyframes bounce {
                    0%, 100% {
                        transform: scale(0);
                    }
                    50% {
                        transform: scale(1);
                    }
                }
            `}</style>
        </button>
    );
};

export default CallBtn;