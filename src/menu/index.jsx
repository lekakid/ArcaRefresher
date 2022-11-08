import React from 'react';
import { Description, List, Style, Web } from '@material-ui/icons';

import * as ContextMenu from 'menu/ContextMenu';
import * as AnonymousNick from 'feature/AnonymousNick';
import * as UserProfile from 'feature/UserProfile';
import * as AutoRefresher from 'feature/AutoRefresher';
import * as CategoryStyler from 'feature/CategoryStyler';
import * as ExperienceCustom from 'feature/ExperienceCustom';
import * as MediaBlocker from 'feature/MediaBlocker';
import * as ImageDownloader from 'feature/ImageDownloader';
import * as ImageSearch from 'feature/ImageSearch';
import * as LayoutCustom from 'feature/LayoutCustom';
import * as Memo from 'feature/Memo';
import * as Mute from 'feature/Mute';
import * as MyImage from 'feature/MyImage';
import * as TemporarySave from 'feature/TemporarySave';
import * as ThemeCustomizer from 'feature/ThemeCustomizer';
import * as UserColor from 'feature/UserColor';
import * as DataManagement from 'feature/DataManagement';
import * as VersionInfo from 'feature/VersionInfo';

import ArticleMenu from './ArticleMenu';
import ConfigMenuContainer from './ConfigMenu';
import ContextMenuContainer from './ContextMenu';

function MenuWrapper() {
  return (
    <>
      <ArticleMenu>
        <AnonymousNick.ArticleMenu />
        <ImageDownloader.ArticleMenu />
        <MediaBlocker.ArticleMenu />
        <ExperienceCustom.ArticleMenu />
      </ArticleMenu>
      <ContextMenuContainer>
        <UserProfile.ContextMenu />
        <ImageDownloader.ContextMenu />
        <ImageSearch.ContextMenu />
        <Memo.ContextMenu />
        <Mute.ContextMenu.User />
        <Mute.ContextMenu.Emoticon />
        <MyImage.ContextMenu />
        <UserColor.ContextMenu />
      </ContextMenuContainer>
      <ConfigMenuContainer
        groupList={[
          { key: 'global', icon: <Web />, label: '전역 도구' },
          { key: 'board', icon: <List />, label: '게시판 도구' },
          { key: 'article', icon: <Description />, label: '게시물 도구' },
          { key: 'uiux', icon: <Style />, label: 'UI/UX' },
        ]}
        menuList={[
          { ...Mute.ConfigMenu, group: 'global' },
          { ...Memo.ConfigMenu, group: 'global' },
          { ...UserColor.ConfigMenu, group: 'global' },
          { ...AutoRefresher.ConfigMenu, group: 'board' },
          { ...CategoryStyler.ConfigMenu, group: 'board' },
          { ...ThemeCustomizer.ConfigMenu, group: 'board' },
          { ...AnonymousNick.ConfigMenu, group: 'article' },
          { ...MediaBlocker.ConfigMenu, group: 'article' },
          { ...ImageDownloader.ConfigMenu, group: 'article' },
          { ...ImageSearch.ConfigMenu, group: 'article' },
          { ...MyImage.ConfigMenu, group: 'article' },
          { ...TemporarySave.ConfigMenu, group: 'article' },
          { ...LayoutCustom.ConfigMenu, group: 'uiux' },
          { ...ExperienceCustom.ConfigMenu, group: 'uiux' },
          { ...ContextMenu.ConfigMenu, group: 'uiux' },
          DataManagement.ConfigMenu,
          VersionInfo.ConfigMenu,
        ]}
      />
    </>
  );
}

export default MenuWrapper;
