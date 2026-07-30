import { Head } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import PageHeader from "@/Components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/Components/ui/chart";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Users, FileText, ClipboardList, TrendingUp } from "lucide-react";

const STATUS_LABELS = {
    in_progress: "Sedang Berjalan",
    submitted: "Selesai",
    timed_out: "Waktu Habis",
};

const STATUS_COLORS = {
    in_progress: "#3b82f6",
    submitted: "#22c55e",
    timed_out: "#f97316",
};

export default function Dashboard({ totalUsers, totalExams, totalSessions, avgScore, statusDistribution, scoreBySubject, dailySessions, scoreByGroup, latestSessions }) {
    const statusData = Object.entries(statusDistribution || {}).map(([key, value]) => ({
        status: STATUS_LABELS[key] || key,
        count: value,
        fill: STATUS_COLORS[key] || "#6b7280",
    }));

    return (
        <>
            <Head title="Dashboard" />
            <LayoutApp>
                <PageHeader
                    showButton={false}
                    title="Dashboard"
                    description="Ringkasan data ujian online"
                />

                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="shadow-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                                <Users className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{totalUsers}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Ujian</CardTitle>
                                <FileText className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{totalExams}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Sesi Ujian</CardTitle>
                                <ClipboardList className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{totalSessions}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-none">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Rata-rata Nilai</CardTitle>
                                <TrendingUp className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{avgScore ? Number(avgScore).toFixed(2) : "0"}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle>Status Sesi Ujian</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={{}} className="mx-auto aspect-square max-h-[300px]">
                                    <PieChart>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Pie data={statusData} dataKey="count" nameKey="status" innerRadius={60} outerRadius={120} paddingAngle={4}>
                                            {statusData.map((entry, index) => (
                                                <Cell key={index} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ChartContainer>
                                <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
                                    {statusData.map((item) => (
                                        <div key={item.status} className="flex items-center gap-2">
                                            <div className="size-3 rounded-full" style={{ backgroundColor: item.fill }} />
                                            <span>{item.status}: <strong>{item.count}</strong></span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle>Nilai Rata-rata per Mata Pelajaran</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={{}} className="aspect-[4/3]">
                                    <BarChart data={scoreBySubject || []} margin={{ top: 5, right: 10, left: 10, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fontSize: 11 }} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="avg_score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle>Tren Sesi Ujian (7 Hari Terakhir)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={{}} className="aspect-[4/3]">
                                    <LineChart data={dailySessions || []} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                                    </LineChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle>Nilai Rata-rata per Grup</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={{}} className="aspect-[4/3]">
                                    <BarChart data={scoreByGroup || []} margin={{ top: 5, right: 10, left: 10, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fontSize: 11 }} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="avg_score" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </LayoutApp>
        </>
    );
}
