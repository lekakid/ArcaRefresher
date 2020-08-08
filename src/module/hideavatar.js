import avatarsheet from '../css/hideavatar.css';

export function apply() {
    const css = <style>{avatarsheet}</style>;

    if(window.config.hideAvatar) {
        document.head.append(css);
    }
}
