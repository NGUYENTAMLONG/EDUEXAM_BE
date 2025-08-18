"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      alert("Đăng nhập thành công!");
      // Lưu trạng thái đăng nhập (ví dụ: trong localStorage hoặc context)
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      router.push("/home"); // Chuyển hướng đến trang chủ sau khi đăng nhập
    } else {
      alert("Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button className="w-full" onClick={handleLogin}>
          Đăng nhập
        </Button>
        <div className="mt-4 text-center text-sm">
          Chưa có tài khoản?
          <Link href="/auth/register" className="underline ml-1">
            Đăng ký
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}