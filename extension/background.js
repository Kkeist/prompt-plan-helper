// 点工具栏图标或按快捷键：让当前页面里的悬浮窗打开或收起。
chrome.action.onClicked.addListener((tab) => {
  if (tab && tab.id != null) chrome.tabs.sendMessage(tab.id, { shupian: 'toggle' }, () => void chrome.runtime.lastError);
});

// 真实截图：悬浮窗先收起，再由这里截取当前标签页的可见区域。
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (!msg || msg.shupian !== 'capture') return false;
  chrome.tabs.captureVisibleTab(sender.tab ? sender.tab.windowId : undefined, { format: 'png' }, (dataUrl) => {
    reply(chrome.runtime.lastError || !dataUrl ? { dataUrl: '' } : { dataUrl });
  });
  return true;
});
