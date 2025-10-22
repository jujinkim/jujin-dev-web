---
publish: "false"
title: "Publish Obsidian Using Quartz With Idling Pc"
lang: ja
---


# 遊休PCでObsidianとQuartzを利用してブログを運営する

1.  **概要**
    このブログは、Obsidian、Obsidian Sync、Quartz、そして常に電源が入っているPC（遊休PC）を組み合わせて、構築とデプロイが自動化されています。どこからでもObsidianで記事を作成して同期すれば、別のPCで自動的にビルドとデプロイのプロセスが進行する仕組みです。

2.  **記事の作成と同期：ObsidianとObsidian Sync**
    すべての記事はマークダウン形式でObsidianで作成されます。PC、モバイルなど、どのデバイスからでも記事を作成・修正できます。Obsidianの公式有料サービスであるObsidian Syncを使用して、すべてのデバイスのノートがリアルタイムで同期されます。これがこのシステムの核心であり、ローカルファイルではなくObsidianサーバーを単一の信頼できる情報源（Single Source of Truth）として使用します。

3.  **自動ビルド環境：遊休PC**
    自宅で常に電源が入っているPC（ホームサーバーまたはデスクトップ）がこの役割を担います。このPCにはObsidianアプリがインストールされており、同じObsidianアカウントでログインしてノートを同期します。`scripts/obsidian_watch.sh`シェルスクリプトが`inotify-tools`を使用して、Obsidian Vaultディレクトリのファイル変更をリアルタイムで検出します。

4.  **ビルドとデプロイの自動化：Quartzとシェルスクリプト**
    ファイルの変更が検出されると、`obsidian_watch.sh`スクリプトは`obsidian_manual_sync.sh`スクリプトを実行します。このスクリプトは、次のタスクを順次実行します。
    - Obsidian Vaultの最新コンテンツを`content`ディレクトリにコピー（`rsync`）します。
    - Quartz CLI（`npx quartz build`）を使用して、静的ウェブサイトファイルを`public`ディレクトリにビルドします。
    - 変更がある場合、Gitを使用して自動的にコミットし、リモートリポジトリ（GitHub）にプッシュします。

5.  **最終的なデプロイ：GitHub Actions**
    メインブランチに新しいコミットがプッシュされると、事前に設定されたGitHub Actionsワークフローがトリガーされます。このワークフローは、`public`ディレクトリの静的ファイルをGitHub Pagesにデプロイし、最終的に`dev.jujin.kim`ドメインで新しいコンテンツが確認できるようになります。

6.  **結論**
    このシステムにより、ユーザーは記事の作成だけに集中できます。Obsidianで記事を書いて保存するだけで、複雑なビルドとデプロイのプロセスが自動的に処理されます。Obsidian Syncを中央ハブとして使用し、遊休PCを自動化エージェントとして活用することが、この仕組みの核心的なアイデアです。
