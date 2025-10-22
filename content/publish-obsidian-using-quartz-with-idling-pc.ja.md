---
publish: "false"
lang: ja
---

# 遊休PCでObsidianとQuartzを利用してブログを運営する

## 概要
このブログは、Obsidian、Obsidian Sync、Quartz、そして常に電源が入っているPC（遊休PC）を組み合わせて、構築とデプロイが自動化されています。
どこでもObsidianで記事を作成して同期すれば、別のPCで自動的にビルドとデプロイのプロセスが進行する仕組みです。
これにより、ユーザーは記事の作成だけに集中できます。

## 記事の作成と同期：ObsidianとObsidian Sync
すべての記事はマークダウン形式でObsidianで作成されます。
PC、モバイルなど、どのデバイスでも記事を作成したり修正したりできます。

Obsidianの公式有料サービスであるObsidian Syncを使用して、すべてのデバイスのノートがリアルタイムで同期されます。
これがこのシステムの核心です。ローカルファイルではなく、Obsidianサーバーを単一の真実の源（Single Source of Truth）として使用します。

## 自動ビルド環境：遊休PC
自宅で常に電源が入っているPC（ホームサーバーまたはデスクトップ）がこの役割を担います。
このPCにはObsidianアプリがインストールされており、同じObsidianアカウントでログインしてノートを同期します。

`scripts/obsidian_watch.sh` シェルスクリプトが `inotify-tools` を使用して、Obsidian Vaultディレクトリのファイル変更をリアルタイムで検出します。
ファイルの変更が検出されると、このスクリプトは自動的にビルドとデプロイのプロセスを開始します。

## ビルドとデプロイの自動化：Quartzとシェルスクリプト
`obsidian_watch.sh` スクリプトは `obsidian_manual_sync.sh` スクリプトを実行します。このスクリプトは次の作業を順次実行します。

*   **コンテンツ同期**: Obsidian Vaultの最新内容をプロジェクトの `content` ディレクトリにコピー（`rsync`）します。
*   **サイトビルド**: Quartz CLI（`npx quartz build`）を使用して、マークダウンファイルを静的ウェブサイトファイルに変換し、`public` ディレクトリにビルドします。
*   **Gitプッシュ**: 変更がある場合、Gitを使用して自動的にコミットし、リモートリポジトリ（GitHub）にプッシュします。

## 最終デプロイ：GitHub Pagesとカスタムドメインの接続
メインブランチに新しいコミットがプッシュされると、事前に設定されたGitHub Actionsワークフローがトリガーされます。
このワークフローは `public` ディレクトリの静的ファイルをGitHub Pagesにデプロイします。

### GitHub Pagesの設定
GitHubリポジトリの設定で「Pages」セクションに移動します。
「Source」を「Deploy from a branch」に設定し、「Branch」を `gh-pages` （または `main` ブランチの `docs` フォルダ）に選択した後、`/(root)` フォルダを選択します。
保存するとGitHub Pagesが有効になります。

### カスタムドメインの接続
GitHub Pagesの設定で「Custom domain」セクションに `yourdomain.com` のような希望のドメインを入力します。
ドメイン登録機関（DNSプロバイダー）で `yourdomain.com` に対する `A` レコードをGitHub PagesサーバーのIPアドレスに設定し、`www.yourdomain.com` に対する `CNAME` レコードを `yourusername.github.io` に設定します。
DNS設定が伝播されると、`yourdomain.com` を通じてブログにアクセスできます。

## 結論
このシステムを通じて、ユーザーは記事の作成だけに集中できます。Obsidianで記事を書いて保存するだけで、複雑なビルドとデプロイのプロセスが自動的に処理されます。
Obsidian Syncを中央ハブとして使用し、遊休PCを自動化エージェントとして活用することが、この構造の核心的なアイデアです。
GitHub Pagesとカスタムドメインの接続を通じて、自分だけのブログを簡単に運営できます。
