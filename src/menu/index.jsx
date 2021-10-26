import React from 'react';
import { Description, List, Style, Web } from '@material-ui/icons';

import * as ContextMenu from 'menu/ContextMenu';
import * as AnonymousNick from 'feature/AnonymousNick';
import * as AssistMenu from 'feature/AssistMenu';
import * as AutoRefresher from 'feature/AutoRefresher';
import * as CategoryStyler from 'feature/CategoryStyler';
import * as ExperienceCustom from 'feature/ExperienceCustom';
import * as ImageDownloader from 'feature/ImageDownloader';
import * as ImageSearch from 'feature/ImageSearch';
import * as LayoutCustom from 'feature/LayoutCustom';
import * as Memo from 'feature/Memo';
import * as Mute from 'feature/Mute';
import * as MyImage from 'feature/MyImage';
import * as ShortCut from 'feature/ShortCut';
import * as TemporarySave from 'feature/TemporarySave';
import * as ThemeCustomizer from 'feature/ThemeCustomizer';
import * as UserColor from 'feature/UserColor';

import ArticleMenu from './ArticleMenu';
import ConfigMenu from './ConfigMenu';
import ContextMenuContainer from './ContextMenu';
import DataManagement from './DataManagement';

export default () => (
  <>
    <ArticleMenu>
      <AnonymousNick.ArticleMenu />
      <ExperienceCustom.ArticleMenu />
    </ArticleMenu>
    <ContextMenuContainer>
      <AssistMenu.ContextMenu />
      <ImageDownloader.ContextMenu />
      <ImageSearch.ContextMenu />
      <Memo.ContextMenu />
      <Mute.ContextMenu.Board />
      <Mute.ContextMenu.Emoticon />
      <MyImage.ContextMenu />
      <UserColor.ContextMenu />
    </ContextMenuContainer>
    <ConfigMenu
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
        { ...ImageDownloader.ConfigMenu, group: 'article' },
        { ...ImageSearch.ConfigMenu, group: 'article' },
        { ...MyImage.ConfigMenu, group: 'article' },
        { ...TemporarySave.ConfigMenu, group: 'article' },
        { ...LayoutCustom.ConfigMenu, group: 'uiux' },
        { ...ExperienceCustom.ConfigMenu, group: 'uiux' },
        { ...ContextMenu.ConfigMenu, group: 'uiux' },
        { ...ShortCut.ConfigMenu, group: 'uiux' },
        DataManagement,
      ]}
    />
  </>
);
