---
publish: "true"
title: "Publish Obsidian using Quartz with Idling PC"
lang: ja
---

# 遊休PCでObsidianとQuartzを利用してブログを運営する

1.  **概要**
    このブログは、Obsidian、Obsidian Sync、Quartz、そして常に稼働しているPC（遊休PC）を組み合わせて、ビルドとデプロイが自動化されています。
    どこからでもObsidianで記事を作成して同期すれば、別のPCで自動的にビルドとデプロイのプロセスが進行する仕組みです。
    これにより、ユーザーは記事の作成だけに集中できます。

2.  **記事の作成と同期：ObsidianとObsidian Sync**
    すべての記事はマークダウン形式でObsidianで作成されます。
    PC、モバイルなど、どのデバイスからでも記事を作成・修正できます。

    Obsidianの公式有料サービスであるObsidian Syncを使用して、すべてのデバイスのノートがリアルタイムで同期されます。
    これがこのシステムの核心です。ローカルファイルではなく、Obsidianサーバーを単一の真実の源（Single Source of Truth）として使用します。

3.  **自動ビルド環境：遊休PC**
    自宅で常に稼働しているPC（ホームサーバーまたはデスクトップ）がこの役割を担います。
    このPCにはObsidianアプリがインストールされており、同じObsidianアカウントでログインしてノートを同期します。

    `scripts/obsidian_watch.sh`シェルスクリプトが`inotify-tools`を使用して、Obsidianボールトディレクトリのファイル変更をリアルタイムで検出します。
    ファイルの変更が検出されると、このスクリプトは自動的にビルドとデプロイのプロセスを開始します。

4.  **ビルドとデプロイの自動化：Quartzとシェルスクリプト**
    `obsidian_watch.sh`スクリプトは`obsidian_manual_sync.sh`スクリプトを実行します。このスクリプトは次のタスクを順次実行します。

    *   **コンテンツの同期**：Obsidianボールトの最新内容をプロジェクトの`content`ディレクトリにコピー（`rsync`）します。
    *   **サイトのビルド**：Quartz CLI（`npx quartz build`）を使用して、マークダウンファイルを静的ウェブサイトファイルに変換し、`public`ディレクトリにビルドします。
    *   **Gitプッシュ**：変更がある場合、Gitを使用して自動的にコミットし、リモートリポジトリ（GitHub）にプッシュします。

5.  **最終的なデプロイ：GitHub Pagesとカスタムドメインの接続**
    メインブランチに新しいコミットがプッシュされると、事前に設定されたGitHub Actionsワークフローがトリガーされます。
    このワークフローは、`public`ディレクトリの静的ファイルをGitHub Pagesにデプロイします。

    **GitHub Pagesの設定**：
    GitHubリポジトリの設定で「Pages」セクションに移動します。
    「Source」を「Deploy from a branch」に設定し、「Branch」を`gh-pages`（または`main`ブランチの`docs`フォルダ）に選択した後、`/(root)`フォルダを選択します。
    保存するとGitHub Pagesが有効になります。

    **カスタムドメインの接続**：
    GitHub Pagesの設定で「Custom domain」セクションに`yourdomain.com`のような希望のドメインを入力します。
    ドメイン登録機関（DNSプロバイダー）で、`yourdomain.com`に対する`A`レコードをGitHub PagesサーバーのIPアドレスに設定し、`www.yourdomain.com`に対する`CNAME`レコードを`yourusername.github.io`に設定します。
    DNS設定が伝播されると、`yourdomain.com`を通じてブログにアクセスできます。

6.  **結論**
    このシステムを通じて、ユーザーは記事の作成だけに集中できます。Obsidianで記事を書いて保存するだけで、複雑なビルドとデプロイのプロセスが自動的に処理されます。
    Obsidian Syncを中央ハブとして使用し、遊休PCを自動化エージェントとして活用することが、この仕組みの核心的なアイデアです。
    GitHub Pagesとカスタムドメインの接続により、自分だけのブログを簡単に運営できます。
