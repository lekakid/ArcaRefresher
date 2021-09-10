import React from 'react';

import * as ContextMenu from 'menu/ContextMenu';
import * as AnonymousNick from 'feature/AnonymousNick';
import * as ArticleRemover from 'feature/ArticleRemover';
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

// ConfigMenu 덜 고침
export default () => (
  <>
    <ArticleMenu>
      <AnonymousNick.ArticleMenu />
    </ArticleMenu>
    <ConfigMenu
      menuList={[
        ContextMenu.ConfigMenu,
        ArticleRemover.ConfigMenu,
        AutoRefresher.ConfigMenu,
        CategoryStyler.ConfigMenu,
        ExperienceCustom.ConfigMenu,
        ImageDownloader.ConfigMenu,
        LayoutCustom.ConfigMenu,
        Memo.ConfigMenu,
        Mute.ConfigMenu,
        MyImage.ConfigMenu,
        ShortCut.ConfigMenu,
        TemporarySave.ConfigMenu,
        ThemeCustomizer.ConfigMenu,
        UserColor.ConfigMenu,
      ]}
    />
    <ContextMenuContainer>
      <ImageDownloader.ContextMenu />
      <ImageSearch.ContextMenu />
      <Memo.ContextMenu />
      <Mute.ContextMenu.Board />
      <Mute.ContextMenu.Emoticon />
      <MyImage.ContextMenu />
      <UserColor.ContextMenu />
    </ContextMenuContainer>
  </>
);
