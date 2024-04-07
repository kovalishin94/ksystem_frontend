<template>
    <div class="h-[80vh] grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div class="text-center">
            <p class="text-5xl font-semibold text-gray-600">Исчерпаны попытки прохождения теста</p>

            <div class="mt-10 flex items-center justify-center gap-x-6">
                <RouterLink :to="{ name: 'test' }"
                    class="rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                    Вернуться к списку тестов
                </RouterLink>
            </div>
        </div>
    </div>
</template>
