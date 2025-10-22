---
publish: "false"
title: Publish Obsidian using Quartz with Idling PC
lang: ko
---

# 놀고 있는 PC로 Obsidian과 Quartz를 이용해 블로그 운영하기

1.  **개요**
    이 블로그는 Obsidian, Obsidian Sync, Quartz, 그리고 항상 켜져 있는 PC(놀고 있는 PC)를 조합하여 구축 및 배포가 자동화되어 있습니다. 어디서든 Obsidian으로 글을 작성하고 동기화하면, 별도의 PC에서 자동으로 빌드 및 배포 과정이 진행되는 구조입니다.

2.  **글 작성 및 동기화: Obsidian과 Obsidian Sync**
    모든 글은 마크다운 형식으로 Obsidian에서 작성됩니다. PC, 모바일 등 어떤 기기에서든 글을 작성하거나 수정할 수 있습니다. Obsidian의 공식 유료 서비스인 Obsidian Sync를 사용하여 모든 기기의 노트가 실시간으로 동기화됩니다. 이것이 이 시스템의 핵심으로, 로컬 파일이 아닌 Obsidian 서버를 단일 진실 공급원(Single Source of Truth)으로 사용합니다.

3.  **자동 빌드 환경: 놀고 있는 PC**
    집에 항상 켜져 있는 PC(홈 서버 또는 데스크톱)가 이 역할을 담당합니다. 이 PC에는 Obsidian 앱이 설치되어 있으며, 동일한 Obsidian 계정으로 로그인하여 노트를 동기화합니다. `scripts/obsidian_watch.sh` 셸 스크립트가 `inotify-tools`를 사용하여 Obsidian 볼트 디렉토리의 파일 변경을 실시간으로 감지합니다.

4.  **빌드 및 배포 자동화: Quartz와 셸 스크립트**
    파일 변경이 감지되면, `obsidian_watch.sh` 스크립트는 `obsidian_manual_sync.sh` 스크립트를 실행합니다. 이 스크립트는 다음 작업을 순차적으로 수행합니다.
    - Obsidian 볼트의 최신 내용을 `content` 디렉토리로 복사(`rsync`)합니다.
    - Quartz CLI(`npx quartz build`)를 사용하여 정적 웹사이트 파일을 `public` 디렉토리로 빌드합니다.
    - 변경 사항이 있을 경우, Git을 사용하여 자동으로 커밋하고 원격 저장소(GitHub)로 푸시합니다.

5.  **최종 배포: GitHub Actions**
    메인 브랜치에 새로운 커밋이 푸시되면, 미리 설정된 GitHub Actions 워크플로우가 트리거됩니다. 이 워크플로우는 `public` 디렉토리의 정적 파일들을 GitHub Pages로 배포하여, 최종적으로 `dev.jujin.kim` 도메인에서 새로운 내용을 확인할 수 있게 됩니다.

6.  **결론**
    이 시스템을 통해 사용자는 글 작성에만 집중할 수 있습니다. Obsidian에 글을 쓰고 저장하는 것만으로 복잡한 빌드 및 배포 과정이 자동으로 처리됩니다. Obsidian Sync를 중앙 허브로 사용하고, 놀고 있는 PC를 자동화 에이전트로 활용하는 것이 이 구조의 핵심 아이디어입니다.
