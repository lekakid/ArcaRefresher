import React from 'react';

import AnonymousNick from 'feature/AnonymousNick';
import ArticleRemover from 'feature/ArticleRemover';
import AutoRefresher from 'feature/AutoRefresher';
import CategoryStyler from 'feature/CategoryStyler';
import CommentRefresh from 'feature/CommentRefresh';
import ExperienceCustom from 'feature/ExperienceCustom';
import ImageDownloader from 'feature/ImageDownloader';
import IPInfo from 'feature/IPInfo';
import LayoutCustom from 'feature/LayoutCustom';
import Memo from 'feature/Memo';
import Mute from 'feature/Mute';
import MyImage from 'feature/MyImage';
import ShortCut from 'feature/ShortCut';
import TemporarySave from 'feature/TemporarySave';
import ThemeCustomizer from 'feature/ThemeCustomizer';
import UserColor from 'feature/UserColor';

export default () => (
  <>
    <AutoRefresher />
    <CommentRefresh />
    <ArticleRemover />
    <ImageDownloader />
    <IPInfo />
    <AnonymousNick />
    <Memo />
    <LayoutCustom />
    <ExperienceCustom />
    <TemporarySave />
    <Mute />
    <MyImage />
    <CategoryStyler />
    <UserColor />
    <ShortCut />
    <ThemeCustomizer />
  </>
);
