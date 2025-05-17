// src/components/CenterArea/Home/TweetForm.tsx
"use client";

import styles from "@/styles/TweetForm.module.css";
import btn from "@/styles/Button.module.css";

import { useState } from "react";
import { useUserStore } from "@/stores/useUserStore";

export default function TweetForm() {
  const user = useUserStore((s) => s.user);
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!text.trim()) {
      setError("ツイート内容を入力してね");
      return;
    }

    const newTweet = {
      account_id: user?.id,
      text,
      image: imageUrl || null,
      likes: 0,
      retweets: 0,
      replies: 0,
      views: 0,
      datetime: new Date().toLocaleString("sv", { timeZone: "Asia/Tokyo" }),
      location: null,
      delete_flag: 0,
    };

    try {
      const res = await fetch("http://localhost:5000/tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTweet),
      });
      if (!res.ok) throw new Error("ツイート投稿に失敗しました");
      setText("");
      setImageUrl("");
      // 投稿後にタイムラインをリロード
      window.location.reload();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("予期せぬエラーが発生しました");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="いまどうしてる？"
        className={styles.textarea}
        rows={3}
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="画像URL (任意)"
        className={styles.input}
      />
      <button type="submit" className={`${btn.button} ${btn.primary}`}>
        ツイート
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
