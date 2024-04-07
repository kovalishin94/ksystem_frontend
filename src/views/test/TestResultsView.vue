<template>
    <h1 class="text-3xl text-center">Результаты теста: {{ testDetail.name }}</h1>
    <div class="flex flex-col items-center mt-4 gap-y-2" v-if="testResults.length">
        <div class="container w-[400px]" v-for="result in testResults">
            <p class="text-xl text-center mb-2">Результаты попытки № {{ result.attempt }}: <strong>{{
                (result.correct_answers / countQuestions).toFixed(4) *
                100 }}%</strong></p>
            <DoughnutChart :chartData="{
                labels: ['Верные ответы', 'Неверные ответы'],
                datasets: [
                    {
                        data: [result.correct_answers, countQuestions - result.correct_answers],
                        backgroundColor: ['#8FCB9B', '#E0777D']
                    }
                ]
            }" :options="options" />
        </div>
    </div>
</template>

<script>
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";
import axios from 'axios';

Chart.register(...registerables);
export default {
    components: { DoughnutChart, },
    data() {
        return {
            options: {
                plugins: {
                    legend: {
                        display: false,
                    }
                }
            },
            testDetail: {},
            testResults: [],
            countQuestions: 0
        }
    },
    mounted() {
        this.getTestResults()
        this.getTestDetail()
    },
    methods: {
        async getTestResults() {
            try {
                const response = await axios.get(`/api/test/results/my_results/?id=${this.$route.params.id}`)
                this.testResults = response.data.data
                this.countQuestions = response.data.count_questions

            } catch (error) {
                console.log(error)
            }
        },
        async getTestDetail() {
            try {
                const response = await axios.get(`/api/test/${this.$route.params.id}/`)
                this.testDetail = response.data
            } catch (error) {
                if (error.code === 'ERR_NETWORK') {
                    this.toastStore.showToast(5000, 'Ошибка сервера', 'bg-red-500')
                }
            }
        },
    }
}
</script>
