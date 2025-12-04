import React from 'react';
import Skeleton from './Skeleton';

const MealPlanSkeleton: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Date Selector Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-16 h-3" />
                            <Skeleton className="w-32 h-6" />
                        </div>
                    </div>
                    <Skeleton className="w-24 h-10 rounded-lg" />
                </div>
            </div>

            {/* Summary Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 h-48">
                    <div className="flex items-center gap-3 mb-4">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="w-48 h-6" />
                    </div>
                    <Skeleton className="w-full h-20 rounded-xl mb-4" />
                    <div className="flex gap-8">
                        <Skeleton className="w-24 h-12" />
                        <Skeleton className="w-24 h-12" />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-48 flex items-center justify-center">
                    <Skeleton className="w-32 h-32 rounded-full" />
                </div>
            </div>

            {/* Meal Cards Skeleton */}
            <div>
                <div className="flex gap-4 mb-4">
                    <Skeleton className="w-24 h-8 rounded-full" />
                    <Skeleton className="w-24 h-8 rounded-full" />
                    <Skeleton className="w-24 h-8 rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 h-64">
                            <div className="flex justify-between mb-4">
                                <div className="flex gap-2">
                                    <Skeleton className="w-8 h-8 rounded-lg" />
                                    <div>
                                        <Skeleton className="w-12 h-4 mb-1" />
                                        <Skeleton className="w-24 h-6" />
                                    </div>
                                </div>
                            </div>
                            <Skeleton className="w-32 h-5 mb-4" />
                            <Skeleton className="w-full h-16 rounded-lg mb-4" />
                            <div className="grid grid-cols-4 gap-1">
                                <Skeleton className="h-10 rounded" />
                                <Skeleton className="h-10 rounded" />
                                <Skeleton className="h-10 rounded" />
                                <Skeleton className="h-10 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MealPlanSkeleton;
