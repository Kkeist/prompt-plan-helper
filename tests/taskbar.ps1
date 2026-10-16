param([string]$Title, [string]$Action = 'state')
# 读小窗口的窗口样式、是否可见和任务栏上浏览器按钮的个数，tests/taskbar.mjs 用；Action 为 minimize 时先发最小化命令再读
Add-Type -TypeDefinition @'
using System; using System.Text; using System.Runtime.InteropServices;
public class TB {
  delegate bool P(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] static extern bool EnumWindows(P p, IntPtr l);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] static extern int GetClassName(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern int GetWindowLong(IntPtr h, int i);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool PostMessage(IntPtr h, uint m, IntPtr w, IntPtr l);
  public static IntPtr Find(string title) {
    IntPtr hit = IntPtr.Zero;
    EnumWindows((h, l) => {
      var c = new StringBuilder(64); GetClassName(h, c, 64);
      if (c.ToString() != "Chrome_WidgetWin_1") return true;
      var t = new StringBuilder(256); GetWindowText(h, t, 256);
      if (t.ToString() == title) { hit = h; return false; }
      return true;
    }, IntPtr.Zero);
    return hit;
  }
}
'@
Add-Type -AssemblyName UIAutomationClient, UIAutomationTypes
$h = [TB]::Find($Title)
# 和点最小化按钮一样：发 WM_SYSCOMMAND / SC_MINIMIZE
if ($Action -eq 'minimize' -and $h -ne [IntPtr]::Zero) { [TB]::PostMessage($h, 0x0112, [IntPtr]0xF020, [IntPtr]::Zero) | Out-Null; Start-Sleep -Milliseconds 1200 }
$root = [System.Windows.Automation.AutomationElement]::RootElement
$prop = [System.Windows.Automation.AutomationElement]::ClassNameProperty
$tray = $root.FindFirst([System.Windows.Automation.TreeScope]::Children, (New-Object System.Windows.Automation.PropertyCondition($prop, 'Shell_TrayWnd')))
$buttons = 0
foreach ($e in $tray.FindAll([System.Windows.Automation.TreeScope]::Descendants, [System.Windows.Automation.Condition]::TrueCondition)) {
  if ($e.Current.ClassName -match 'TaskListButton' -and $e.Current.Name -match 'Edge|Chrome') { $buttons++ }
}
$found = $h -ne [IntPtr]::Zero
$ex = 0
if ($found) { $ex = [TB]::GetWindowLong($h, -20) }
$o = [ordered]@{
  found = $found
  toolWindow = (($ex -band 0x80) -ne 0)
  appWindow = (($ex -band 0x40000) -ne 0)
  iconic = ($found -and [TB]::IsIconic($h))
  visible = ($found -and [TB]::IsWindowVisible($h))
  buttons = $buttons
}
$o | ConvertTo-Json -Compress
