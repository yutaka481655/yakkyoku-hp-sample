# さくら薬局 ホームページ デザイン案（サンプル）

薬局ホームページのデザイン案を3パターン作成した静的サイトです。薬局名・住所・電話番号・スタッフ名・写真はすべて仮データです。

- `index.html` — デザイン一覧ページ
- `v2/index.html` — 第二版（1案に絞って作り込んだ最新版）。受付時間と休業日は `v2/js/main.js` の先頭で設定
- `clean.html` — ① 清潔感・信頼タイプ
- `warm.html` — ② やさしさ・温かみタイプ
- `modern.html` — ③ モダン・洗練タイプ（写真素材が決まるまで保留中）

## 開発

ビルド不要の静的HTML/CSSです。`index.html` をブラウザで開くか、ローカルサーバーで配信してください。

```
npx serve .
```

## デプロイ

GitHubリポジトリに push 後、Vercel で「Add New Project」→ このリポジトリを Import すると、push ごとに自動デプロイされます（Framework Preset は “Other” のままで可）。
