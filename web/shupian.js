(function () {
'use strict';
const LOCALES = {"en":{"name":"English","ui":{"parts":"Parts","part":"part","circle_a_part":"Pick a part","part_name":"Part name","remove_this_part":"Remove this part","describe_the_issue_you_can_several_parts":"Describe the issue. You can @ several parts.","where_part":"Part: ","page_feedback":"Page feedback","point_it_out":"Point it out","write_a_note":"Describe it","plan":"Plan","click_a_part_to_aim_the_note_at_it":"Click a part to aim your note at it.","stage_title":"Progress","stage_label":"Progress: {name}","tune_title":"Adjustable values","tuned_value":"Changed value: {label} = {value} (was {was})","submit":"Submit","not_built_yet":"Not built yet: {n}","nothing_built_yet":"Nothing has been built yet.","click_to_pick_the_feature":"Click to choose it, then write below","credit_by":"created by KKeist","credit_same":"","credit_link":"Personal site","credit_url":"https://kk.kkeist.com/","credit_avatar":"credit/en.png","page":"page","feature":"feature","the_what_name_cannot_be_empty":"The {what} name cannot be empty.","there_is_already_a_what_with_this_name":"There is already a {what} with this name. Please use another name.","there_is_nowhere_to_add_it":"There is nowhere to add it.","browser_storage_is_full_and_the_latest":"Browser storage is full and the latest changes were not saved. Export them first.","new_project":"New project","deleted_project_name":"Deleted project \"{name}\".","undo":"Undo","could_not_open_the_folder_why":"Could not open the folder: {why}","the_folder_permission_could_not_be_saved":"The folder permission could not be saved; choose the folder again next time.","choose_where_to_put_the_new_folder":"Choose where to put the new folder.","folder_name":"Folder name","a_folder_with_this_name_already_exists":"A folder with this name already exists. Choose another name.","the_name_cannot_be_empty_or_contain_any_of":"The name cannot be empty or contain any of / : * ? \" < > |","could_not_create_the_folder_why":"Could not create the folder: {why}","new_folder":"New folder","cancel":"Cancel","create":"Create","choose_the_folder_that_holds_the_plan":"Choose the folder that holds the plan.","could_not_select_the_plan_why":"Could not select the plan: {why}","loaded_the_plan_from_the_folder":"Loaded the plan from the folder.","saved_to_the_folder_name":"Saved to the folder \"{name}\".","this_folder_already_has_a_plan":"This folder already has a plan","which_one_to_use_replace_with_current":"Which one to use? \"Replace with current\" overwrites the plan in the folder.","use_the_one_in_the_folder":"Use the one in the folder","save_as_a_new_plan":"Save as a new plan","replace_with_current":"Replace with current","plan_name":"Plan name","the_name_cannot_be_empty":"The name cannot be empty.","the_name_cannot_be_longer_than_60_characters":"The name cannot be longer than 60 characters or contain any of / : * ? \" < > |","a_plan_with_this_name_already_exists_choose":"A plan with this name already exists. Choose another name.","new_plan_in_this_folder":"New plan in this folder","could_not_save_to_the_folder_why":"Could not save to the folder: {why}","choose_an_existing_folder":"Choose an existing folder","drop_a_folder_not_a_file":"Drop a folder, not a file.","this_browser_cannot_open_dropped_folders_use":"This browser cannot open dropped folders. Use \"Choose another folder\".","could_not_read_the_dropped_item_why":"Could not read the dropped item: {why}","several_folders_have_this_name_choose_one":"Several folders have this name. Choose one","permission_was_not_granted_why":"Permission was not granted: {why}","no_read_and_write_permission":"no read and write permission","the_address_of_this_folder_was_not_found_you":"The address of this folder was not found. You can open and save the plan, but not copy the address.","folder_disconnected":"Folder disconnected.","could_not_read_the_folder_why":"Could not read the folder: {why}","there_is_no_plan_in_the_folder_yet":"There is no plan in the folder yet.","already_up_to_date":"Already up to date.","both_the_folder_and_the_page_changed_merged":"Both the folder and the page changed. Merged; {n} places changed in the same spot, so the newer one was used.","both_the_folder_and_the_page_changed_merged_2":"Both the folder and the page changed. Merged.","click_to_edit":"Click to edit","click_to_fill_in":"Click to fill in.","content":"Content","add":"Add","name":"Name","describe_the_issue_you_can_several_features":"Describe the issue. You can @ several features.","report_an_issue":"Report an issue","write_the_issue_first":"Write the issue first.","choose_a_feature_for_every_issue":"Choose a feature for every issue.","added_n_issues":"Added {n} issues.","issue_description":"Issue description","feature_name":"Feature name","add_a_feature":"Add a feature","feature_list":"Feature list","initial_plan":"Initial plan","plan_confirmed":"Confirmed","earlier_versions":"Earlier versions","restore":"Restore","there_are_no_earlier_versions_yet":"There are no earlier versions yet.","removed_features_names":"Removed features: {names}","restored_the_version":"Restored the version from {time}.","could_not_read_the_history_why":"Could not read the earlier versions: {why}","could_not_save_the_history_why":"Could not save the earlier version: {why}","could_not_load_the_draft_why":"Could not read the unsent issues: {why}","could_not_save_the_draft_why":"Could not save the unsent issues: {why}","loaded_the_feature_list_from_the_folder":"Loaded the feature list from the folder.","project_status":"Project status","done_of_total_done_doing_in_progress":"{done} of {total} done, {doing} in progress","n_open_issues":"{n} open issues","click_to_change_progress":"Click to change progress","click_to_change_the_status":"Click to change the status","fixed":"Fixed","working":"Working","to_do":"To do","delete":"Delete","deleted":"Deleted.","click_to_rename":"Click to rename","untitled_project":"Untitled project","expand_or_collapse":"Expand or collapse","page_name":"Page name","there_is_nothing_to_export":"There is nothing to export.","exported_name":"Exported: {name}","paste_the_plan_or_choose_a_file":"Paste the plan, or choose a file.","content_to_import":"Content to import","this_file_cannot_be_read_check_that_it_is_a":"This file cannot be read. Check that it is a text file.","import":"Import","choose_a_file":"Choose a file","paste_something_or_choose_a_file_first":"Paste something or choose a file first.","the_plan_format_was_not_recognised_the":"The plan format was not recognised; the original text was put under \"Not recognised\".","plan_imported":"Plan imported.","new_plan_created":"New plan created.","example_loaded":"Example loaded.","describe_what_you_want_to_make":"Describe what you want to make.","notes":"Notes","words_for_the_ai":"Words for the AI","copy_prompt":"Copy prompt","prompt_content":"Prompt content","close":"Close","copy":"Copy","initial_plan_approved":"Initial plan approved","n_left_to_fill_in":"{n} left to fill in","nothing_left_to_fill_in":"Nothing left to fill in","n_still_to_fill_in_fill_them_in_before":"{n} still to fill in. Fill them in before approving.","the_plan_is_confirmed_work_can_start":"The plan is confirmed. Work can start.","confirm_and_start":"Confirm and start","save_to_a_folder":"Save to a folder","folder_name_2":"Folder: {name}","synced_at_time":"synced at {time}","switch_or_create_a_plan":"Switch or create a plan","handy_for_opening_a_cli":"Handy for opening a CLI","copy_path":"Copy path","contents":"Contents","copy_everything":"Copy everything","full_plan":"Full plan","copy_it_and_send_it_to_the_ai":"Copy it and send it to the AI.","export":"Export","view_an_example":"View an example","new_blank_plan":"New blank plan","there_is_nothing_to_undo":"There is nothing to undo.","redo":"Redo","there_is_nothing_to_redo":"There is nothing to redo.","folders_need_chrome_or_edge_on_a_computer":"Folders need Chrome or Edge on a computer","connect_a_folder":"Connect a folder","allow_the_folder_again":"Allow the folder again","refresh":"Refresh","disconnect_the_folder":"Disconnect the folder","delete_project":"Delete project","download_the_desktop_version_windows":"Download the desktop version (Windows)","recent":"Recent","close_tab":"Close tab","prompt_plan_helper":"Prompt plan helper","language":"Language","keep_the_original_description":"Keep the original description","more":"More","install_the_browser_extension":"Install the browser extension","the_page_floating_window_needs_the_browser_extension":"Writing issues on web pages needs the browser extension.","the_page_floating_window_is_on_alt_shift_s":"The floating window on web pages is on. Shortcut: Alt+Shift+S.","extension_step_open":"Open the browser's extensions page and turn on Developer mode.","extension_step_load":"Click Load unpacked and choose the folder below.","extension_step_done":"Reopen this window afterwards.","extension_step_button":"A floating button appears at the bottom right of web pages.","extension_step_firefox":"Firefox: click Load Temporary Add-on and choose manifest.json in the folder above. It must be loaded again after Firefox restarts.","install_the_floating_window":"Install the floating window","bookmark_title":"Bookmark (use this for Firefox)","bookmark_steps":"Drag the button below to the bookmarks bar, then click it on the page to check. The floating window appears in that page.","drag_to_the_bookmarks_bar":"Drag to the bookmarks bar","bookmark_limits":"With the bookmark, adding to the plan works only on local pages (localhost). Other pages can only copy text.","extension_title":"Browser extension","open_the_install_page_in_name":"Open the install page in {name}","extension_folder":"Extension folder","no_edge_or_chrome_was_found":"Edge, Chrome or Firefox was not found.","open_the_extensions_page_in_name":"Open the extensions page in {name}","could_not_prepare_the_extension_why":"Could not prepare the extension files: {why}","could_not_open_the_extensions_page_why":"Could not open the extensions page: {why}","one_click_install_title":"Install to a browser","one_click_install_hint":"Add the extension to the browser, then turn it on in the browser's extensions page. The floating button then appears at the bottom right of web pages.","install_to_name":"Install to {name}","registered_in_name_enable_it":"Added to {name}. Turn on \"{app}\" in the extensions page of {name}.","the_extension_is_registered_enable_it_in_the_browser":"The extension is added to the browser and not turned on yet.","manual_install":"Manual install","could_not_register_the_extension_why":"Could not register the extension: {why}","the_extension_package_was_not_found_run_the_build":"The extension package was not found.","there_is_no_plan_yet":"There is no plan yet.","saved":"Saved.","saved_in_the_browser":"Saved in the browser.","drop_to_open_the_folder":"Drop to open the folder.","reading_recent_folders":"Reading recent folders","plan_file":"Plan: {file} ▾","in_use":"In use","done_of_total_done_n_left_to_fill_in":"{done} of {total} done, {n} left to fill in","no_plan_yet":"No plan yet","current":"Current","folders_in_use":"Folders in use","recent_folders":"Recent folders","connected_folders":"Connected folders","no_recent_folders_were_found_use_the_button":"No recent folders were found. Use the buttons above to choose one.","new_plan":"New plan","choose_another_folder":"Choose another folder","could_not_read_the_folder_list_why":"Could not read the folder list: {why}","click_to_change_the_feature":"Click to change the feature","remove_this_feature":"Remove this feature","choose_features":"Choose features","add_an_issue":"Add another","copied":"Copied.","the_browser_does_not_allow_automatic_copying":"The browser does not allow automatic copying. The text is selected; press Ctrl+C.","full_text":"Full text","describe_what_to_change":"Describe what to change.","clear":"Clear","collapse":"Collapse","the_screenshot_is_on_the_clipboard_paste_it":"The screenshot is on the clipboard; paste it separately","these_features_are_no_longer_in_the_plan":"These features are no longer in the plan: {names}. Choose again.","added_n_issues_to_the_plan":"Added {n} issues to the plan.","could_not_add_to_the_plan_why":"Could not add to the plan: {why}","the_desktop_window_did_not_respond":"The desktop window did not respond.","capture_failed_why":"Capture failed: {why}","screenshot_copied":"Screenshot copied.","downloaded_name":"Downloaded: {name}","pick_an_element":"Pick an element","region_screenshot":"Region screenshot","current_page":"Current page","current_page_title":"Current page: {title}","screenshot":"Screenshot","change_the_plan":"Change the plan","this_plan_has_no_features_yet":"This plan has no features yet.","no_folder_with_a_plan_was_found":"No folder with a plan was found.","open_the_desktop_window_first_to_add_issues":"Open the desktop window first to add issues to the plan.","the_desktop_window_did_not_respond_only":"The desktop window did not respond. Only copying is available.","add_to_plan":"Add to plan","copy_text":"Copy text","copy_screenshot":"Copy screenshot","click_the_element_to_pick_press_esc_to":"Click the element to pick. Press Esc to cancel.","drag_to_select_the_area_press_esc_to_cancel":"Drag to select the area. Press Esc to cancel.","add_a_way_of_using_it":"Add a way of using it","add_a_page":"Add a page","page_title_label":"Page title: ","headings_label":"Headings on the page: ","controls_label":"Things to click on the page: ","where_page":"Page: ","where_element":"Element: ","script_error":"Script error","unhandled_promise_error":"Unhandled Promise error: ","kind_shot":"Screenshot","kind_fake_shot":"Simulated screenshot","element_text":" (text \"{text}\")"},"doc":{"sep":": ","title":"Plan","titleAlt":["Change","Feature list"],"featureList":"Feature list","status":"Status","updated":"Updated","tbd":"TBD","missing":"missing ","states":{"draft":"Draft","doing":"In progress","approved":"Approved"},"progress":{"label":"Progress","todo":"Not started","doing":"In progress","done":"Done"},"pageFields":["Page purpose:","Page elements:","Entry point:"],"featureFields":["Feature description:","Acceptance criteria:","Constraints:"],"progressLabel":"Progress:","newFlow":"〈Name〉: TBD: what the user does → what they see","labels":{"parts":["Page elements","What is on the page","What is on the screen","Parts","Part"],"cases":["Acceptance criteria","Done when","Use cases","Use case"],"what":["Feature description","What it does"],"progress":["Progress"],"issues":["Issues"]},"fixed":"Fixed","working":"Working","issuesLabel":"Issues:","originalDescription":"Original description","originalPlaceholder":"〈Put the first words here, unchanged. The AI does not read this section unless it needs to check the original intent.〉","unrecognised":"Not recognised","projectName":"〈Project name〉","planFile":"plan.md","filePrefix":"plan-","featureFile":"features.md","featurePrefix":"features-","example":"e.g. ","ideaPlaceholder":"(write your idea here)","currentPlan":"Current plan:","myIdea":"My idea:","extraNotes":"Extra notes:","promptRules":["Turn the content below into a plan, as one complete Markdown document in the given format.","","Rules:","1. Use only what I have said. Where I have not said it, write \"TBD: what is missing\" in place; do not add a separate list.","2. Give the full draft in one go, not in parts.","3. Ways of using it, things on a screen and \"done when\" are each written on one line: step → step.","4. I do not know code. The plan says only the result I want, not how to build it.","5. What to build first and how to build it are yours to decide; write that up separately for me to confirm, not inside the plan.","6. End the reply with a list of gaps: number, place, what is missing, a suggestion, one concrete default. Suggestions stay in the reply and go into the plan only after I confirm.","7. Put my first words, unchanged, at the end under \"Original description\". Do not read that section normally; read it only to check what I originally meant.","","Format:"],"feedback":{"page":"Page: ","element":"The thing I mean: ","styles":"Its styles now: ","shot":"Screenshot: ","placeholder":"(write what to change here)","errors":"Recent errors on the page:"},"fieldHeader":"Field","listSep":", "},"cli":{"not_found":"Not found: {path}","file_label":"File: {path}","project_label":"Project: {name}","unnamed":"(unnamed)","status_label":"Status: {state}","no_status_line":"(no status line)","counts":"{pages} pages, {features} features","tbd_count":"TBD: {n}","tbd_line":"  line {line}: {text}","dup_page":"Duplicate page name: {name}","dup_feature":"Duplicate feature name: {name}","approved_but_tbd":"The status is approved, but some items are still TBD","problem":"Problem: {text}","verdict_ok":"Result: nothing is TBD. Ready to build once confirmed.","verdict_no":"Result: not ready to build yet.","progress_total":"Done {done} / {total}","progress_states":"Progress must be todo, doing or done","no_such_feature":"No such feature: {name}","progress_updated":"Updated: {name} → {status}","window_check_failed":"Could not check for an open window: {why}","service_not_started":"The desktop service did not start.","window_raised":"The small window is already open and has been brought to the front.","no_browser":"Edge or Chrome was not found. Open this address directly: {url}","opened":"Opened: {url}","usage":"Usage: node shupian.mjs check [plan] | progress [plan] [feature todo|doing|done] | issues [plan] | issue [plan] <number> todo|doing|done | snapshot [plan] | app [hub|plan]","app_needs_repo":"The desktop window comes with the full tool (the desktop app or the repository); this copy only has the command line.","build_missing_keys":"Build failed: keys used in code are missing from the locale files:","build_unused_keys":"Build failed: locale files contain unused keys:","build_text_in_code":"Build failed: Chinese strings found in code. Move text into the locale files:","build_banned":"Build failed: the release contains forbidden content: {what}","csc_not_found":"csc.exe (.NET Framework 4) was not found. The desktop version can only be built on Windows.","ports_busy":"All ports are in use: {why}","issue_line":"{n}. [{state}] {feature}: {text}","issue_todo":"To do","issue_doing":"Working","issue_done":"Fixed","no_issues":"No issues recorded.","no_such_issue":"No issue number {n}","issue_states":"The state must be todo, doing or done","issue_updated":"Updated: issue {n} → {state}","no_feature_list_yet":"There is no feature list yet: it is created when work starts.","snapshot_saved":"Saved the current feature list as an earlier version.","snapshot_not_needed":"The feature list has not changed, nothing to save."},"exe":{"show_window":"Show window","exit":"Exit","tray_running":"Running in the tray. Press Ctrl+Alt+S to open.","tray_hotkey_taken":"Running in the tray. Ctrl+Alt+S is taken; click the tray icon to open.","tray_hidden":"The tray icon is under the ^ at the right of the taskbar. Drag it onto the taskbar to keep it visible."}},"zh":{"name":"中文","ui":{"parts":"部件","part":"部件","circle_a_part":"圈选部件","part_name":"部件名称","remove_this_part":"去掉这个部件","describe_the_issue_you_can_several_parts":"写下问题，可以 @ 多个部件。","where_part":"部件：","page_feedback":"页面反馈","point_it_out":"点出位置","write_a_note":"写说明","plan":"计划书","click_a_part_to_aim_the_note_at_it":"点一个部件，说明就针对它。","stage_title":"进度","stage_label":"进度：{name}","tune_title":"可调参数","tuned_value":"调过的参数：{label} = {value}（原来 {was}）","submit":"提交","not_built_yet":"还没做 {n} 项","nothing_built_yet":"还没有做出来的功能。","click_to_pick_the_feature":"点击选中，在下面写问题","credit_by":"哐哐哐況 制作。","credit_same":"全网同名，更多好玩的请前往→","credit_link":"哐哐的个人站。","credit_url":"https://kb.kkeist.com/","credit_avatar":"credit/zh.png","page":"页面","feature":"功能","the_what_name_cannot_be_empty":"{what}名称不能为空。","there_is_already_a_what_with_this_name":"已有同名{what}，请换一个名称。","there_is_nowhere_to_add_it":"没有找到可以添加的位置。","browser_storage_is_full_and_the_latest":"浏览器存储空间已满，最近的修改未保存，请先导出。","new_project":"新项目","deleted_project_name":"已删除项目「{name}」。","undo":"撤销","could_not_open_the_folder_why":"无法打开文件夹：{why}","the_folder_permission_could_not_be_saved":"未能保存文件夹授权，下次打开需要重新选择文件夹。","choose_where_to_put_the_new_folder":"选择新文件夹放在哪里。","folder_name":"文件夹名称","a_folder_with_this_name_already_exists":"已有同名文件夹，请换一个名称。","the_name_cannot_be_empty_or_contain_any_of":"名称不能为空，也不能包含 / : * ? \" < > | 这些符号。","could_not_create_the_folder_why":"无法新建文件夹：{why}","new_folder":"新建文件夹","cancel":"取消","create":"创建","choose_the_folder_that_holds_the_plan":"选择计划书所在的文件夹。","could_not_select_the_plan_why":"无法选定计划书：{why}","loaded_the_plan_from_the_folder":"已载入文件夹中的计划书。","saved_to_the_folder_name":"已保存到文件夹「{name}」。","this_folder_already_has_a_plan":"这个文件夹里已有计划书","which_one_to_use_replace_with_current":"用哪一份？选「用当前的替换」会替换文件夹里的计划书。","use_the_one_in_the_folder":"用文件夹里的","save_as_a_new_plan":"存成新的一份","replace_with_current":"用当前的替换","plan_name":"计划书名称","the_name_cannot_be_empty":"名称不能为空。","the_name_cannot_be_longer_than_60_characters":"名称不能超过 60 个字，也不能包含 / : * ? \" < > | 这些符号。","a_plan_with_this_name_already_exists_choose":"已有同名计划书，请换一个名称。","new_plan_in_this_folder":"新建一份计划书","could_not_save_to_the_folder_why":"保存到文件夹失败：{why}","choose_an_existing_folder":"选择已有文件夹","drop_a_folder_not_a_file":"请拖入文件夹，不是文件。","this_browser_cannot_open_dropped_folders_use":"这个浏览器不支持拖入文件夹，请使用「选择别的文件夹」。","could_not_read_the_dropped_item_why":"无法读取拖入的内容：{why}","several_folders_have_this_name_choose_one":"找到多个同名文件夹，请选择","permission_was_not_granted_why":"授权未完成：{why}","no_read_and_write_permission":"没有读写权限","the_address_of_this_folder_was_not_found_you":"没有找到这个文件夹的地址，可以打开和保存计划书，但不能复制地址。","folder_disconnected":"已断开文件夹。","could_not_read_the_folder_why":"读取文件夹失败：{why}","there_is_no_plan_in_the_folder_yet":"文件夹中尚无计划书。","already_up_to_date":"已是最新。","both_the_folder_and_the_page_changed_merged":"文件夹和页面都有修改，已合并；{n} 处改在同一位置，用了较新的。","both_the_folder_and_the_page_changed_merged_2":"文件夹和页面都有修改，已合并。","click_to_edit":"点击修改","click_to_fill_in":"点击填写。","content":"内容","add":"添加","name":"名称","describe_the_issue_you_can_several_features":"写下问题，可以 @ 多个功能。","report_an_issue":"写问题","write_the_issue_first":"请先写下问题。","choose_a_feature_for_every_issue":"每条问题都要选一个功能。","added_n_issues":"已添加 {n} 条问题。","issue_description":"问题说明","feature_name":"功能名称","add_a_feature":"添加功能","feature_list":"功能清单","initial_plan":"初始计划书","plan_confirmed":"已确认","earlier_versions":"历史版本","restore":"恢复","there_are_no_earlier_versions_yet":"还没有历史版本。","removed_features_names":"已去掉的功能：{names}","restored_the_version":"已恢复到 {time} 的版本。","could_not_read_the_history_why":"无法读取历史版本：{why}","could_not_save_the_history_why":"无法保存历史版本：{why}","could_not_load_the_draft_why":"无法读取未提交的问题：{why}","could_not_save_the_draft_why":"无法保存未提交的问题：{why}","loaded_the_feature_list_from_the_folder":"已载入文件夹中的功能清单。","project_status":"项目情况","done_of_total_done_doing_in_progress":"已完成 {done} / {total}，进行中 {doing}","n_open_issues":"未处理的问题 {n} 条","click_to_change_progress":"点击切换进度","click_to_change_the_status":"点击切换状态","fixed":"已修","working":"处理中","to_do":"待处理","delete":"删除","deleted":"已删除。","click_to_rename":"点击改名","untitled_project":"未命名项目","expand_or_collapse":"展开或收起","page_name":"页面名称","there_is_nothing_to_export":"没有可导出的内容。","exported_name":"已导出：{name}","paste_the_plan_or_choose_a_file":"粘贴计划书内容，或选择文件。","content_to_import":"导入内容","this_file_cannot_be_read_check_that_it_is_a":"无法读取该文件，请确认它是文本文件。","import":"导入","choose_a_file":"选择文件","paste_something_or_choose_a_file_first":"请先粘贴内容或选择文件。","the_plan_format_was_not_recognised_the":"未识别出计划书格式，原文已放入「未识别」。","plan_imported":"已导入计划书。","new_plan_created":"已新建计划书。","example_loaded":"已载入示例。","describe_what_you_want_to_make":"描述要做的东西。","notes":"补充说明","words_for_the_ai":"给 AI 的话","copy_prompt":"复制提示词","prompt_content":"提示词内容","close":"关闭","copy":"复制","initial_plan_approved":"初版已确认","n_left_to_fill_in":"还有 {n} 处待补","nothing_left_to_fill_in":"没有待补","n_still_to_fill_in_fill_them_in_before":"还有 {n} 处待补，补完才能通过。","the_plan_is_confirmed_work_can_start":"计划书已确认，可以开始制作。","confirm_and_start":"确认并开始","save_to_a_folder":"保存到文件夹","folder_name_2":"文件夹：{name}","synced_at_time":"同步于 {time}","switch_or_create_a_plan":"切换或新建计划书","handy_for_opening_a_cli":"方便打开 CLI","copy_path":"复制地址","contents":"目录","copy_everything":"复制全文","full_plan":"计划书全文","copy_it_and_send_it_to_the_ai":"复制后发送给 AI。","export":"导出","view_an_example":"查看示例","new_blank_plan":"新建空白计划书","there_is_nothing_to_undo":"没有可撤销的操作。","redo":"重做","there_is_nothing_to_redo":"没有可重做的操作。","folders_need_chrome_or_edge_on_a_computer":"文件夹功能需要电脑版 Chrome 或 Edge","connect_a_folder":"连接文件夹","allow_the_folder_again":"重新授权文件夹","refresh":"刷新","disconnect_the_folder":"断开文件夹","delete_project":"删除项目","download_the_desktop_version_windows":"下载桌面版（Windows）","recent":"最近","close_tab":"关闭标签","prompt_plan_helper":"prompt 计划书助手","language":"语言","keep_the_original_description":"保留最初的描述","more":"更多","install_the_browser_extension":"安装浏览器扩展","the_page_floating_window_needs_the_browser_extension":"在网页上写问题，需要先安装浏览器扩展。","the_page_floating_window_is_on_alt_shift_s":"网页悬浮窗已开启，快捷键 Alt+Shift+S。","extension_step_open":"打开扩展页面，并打开「开发人员模式」。","extension_step_load":"点「加载解压缩的扩展」，选择下面的文件夹。","extension_step_done":"装好后重新打开这个窗口。","extension_step_button":"网页右下角会出现悬浮按钮。","extension_step_firefox":"Firefox：点「临时载入附加组件」，选择上面文件夹里的 manifest.json。Firefox 重启后需要重新载入。","install_the_floating_window":"安装悬浮窗","bookmark_title":"书签（Firefox 用这个）","bookmark_steps":"把下面的按钮拖到书签栏；在要检查的网页上点一下，悬浮窗就出现在那个页面里。","drag_to_the_bookmarks_bar":"拖到书签栏","bookmark_limits":"用书签时，记进计划书只在本机网页（localhost）上可用，其他网页只能复制文字。","extension_title":"浏览器扩展","open_the_install_page_in_name":"在 {name} 里打开安装页","extension_folder":"扩展文件夹","no_edge_or_chrome_was_found":"没有找到 Edge、Chrome 或 Firefox。","open_the_extensions_page_in_name":"在 {name} 里打开扩展页面","could_not_prepare_the_extension_why":"无法准备扩展文件：{why}","could_not_open_the_extensions_page_why":"无法打开扩展页面：{why}","one_click_install_title":"安装到浏览器","one_click_install_hint":"先把扩展添加到浏览器，再在浏览器的扩展页面里打开它的开关，网页右下角就会出现悬浮按钮。","install_to_name":"安装到 {name}","registered_in_name_enable_it":"已添加到 {name}。请在 {name} 的扩展页面里打开「{app}」的开关。","the_extension_is_registered_enable_it_in_the_browser":"扩展已添加到浏览器，还没有打开开关。","manual_install":"手动安装","could_not_register_the_extension_why":"无法添加扩展：{why}","the_extension_package_was_not_found_run_the_build":"没有找到扩展安装包。","there_is_no_plan_yet":"还没有计划书。","saved":"已保存。","saved_in_the_browser":"已保存到浏览器。","drop_to_open_the_folder":"松开即可打开文件夹。","reading_recent_folders":"正在读取最近的文件夹","plan_file":"计划书：{file} ▾","in_use":"使用中","done_of_total_done_n_left_to_fill_in":"已完成 {done} / {total}，待补 {n} 处","no_plan_yet":"尚无计划书","current":"当前","folders_in_use":"正在使用的文件夹","recent_folders":"最近使用的文件夹","connected_folders":"连接过的文件夹","no_recent_folders_were_found_use_the_button":"没有找到最近使用的文件夹，可以通过上方按钮选择。","new_plan":"新建计划书","choose_another_folder":"选择别的文件夹","could_not_read_the_folder_list_why":"读取文件夹列表失败：{why}","click_to_change_the_feature":"点击更换功能","remove_this_feature":"去掉这个功能","choose_features":"选择功能","add_an_issue":"添加一条","copied":"已复制。","the_browser_does_not_allow_automatic_copying":"浏览器不允许自动复制，全文已选中，请按 Ctrl+C 复制。","full_text":"全文","describe_what_to_change":"写下需要修改的内容。","clear":"清除","collapse":"收起","the_screenshot_is_on_the_clipboard_paste_it":"截图已复制到剪贴板，请另行粘贴","these_features_are_no_longer_in_the_plan":"计划书里已经没有这些功能：{names}，请重新选择。","added_n_issues_to_the_plan":"已记 {n} 条问题到计划书。","could_not_add_to_the_plan_why":"没有记进计划书：{why}","the_desktop_window_did_not_respond":"桌面小窗口没有响应。","capture_failed_why":"截图失败：{why}","screenshot_copied":"截图已复制。","downloaded_name":"已下载：{name}","pick_an_element":"选取元素","region_screenshot":"区域截图","current_page":"当前页面","current_page_title":"当前页面：{title}","screenshot":"截图","change_the_plan":"更换计划书","this_plan_has_no_features_yet":"这个计划书里还没有功能。","no_folder_with_a_plan_was_found":"没有找到带计划书的文件夹。","open_the_desktop_window_first_to_add_issues":"先打开桌面小窗口，才能记进计划书。","the_desktop_window_did_not_respond_only":"桌面小窗口没有响应，只能复制文字。","add_to_plan":"记到计划书","copy_text":"复制文字","copy_screenshot":"复制截图","click_the_element_to_pick_press_esc_to":"点击要选取的元素，按 Esc 取消。","drag_to_select_the_area_press_esc_to_cancel":"拖动选择截图区域，按 Esc 取消。","add_a_way_of_using_it":"添加用法","add_a_page":"添加页面","page_title_label":"页面标题：","headings_label":"页面上能看到的标题：","controls_label":"页面上能点的东西：","where_page":"页面：","where_element":"元素：","script_error":"脚本错误","unhandled_promise_error":"未处理的 Promise 错误：","kind_shot":"截图","kind_fake_shot":"伪截图","element_text":"（文字「{text}」）"},"doc":{"sep":"：","title":"计划书","titleAlt":["修改单","功能清单"],"featureList":"功能清单","status":"状态","updated":"更新","tbd":"待补","missing":"缺","states":{"draft":"草稿","doing":"整理中","approved":"已通过"},"progress":{"label":"进度","todo":"未做","doing":"进行中","done":"已完成"},"pageFields":["页面用途：","页面元素：","进入方式："],"featureFields":["功能说明：","验收标准：","限制条件："],"progressLabel":"进度：","newFlow":"〈名字〉：待补：用户做什么 → 看到什么","labels":{"parts":["页面元素","页面上有什么","界面上有什么","页面里有什么","部件"],"cases":["验收标准","怎么才算做好","用例"],"what":["功能说明","它做什么","做什么","一句话"],"progress":["进度"],"issues":["问题"]},"fixed":"已修","working":"处理中","issuesLabel":"问题：","originalDescription":"最初的描述","originalPlaceholder":"〈把最初说的话原样放在这里。AI 平时不读这一节，需要核对原意时才读。〉","unrecognised":"未识别","projectName":"〈项目名〉","planFile":"计划书.md","filePrefix":"计划书-","featureFile":"功能清单.md","featurePrefix":"功能清单-","example":"例：","ideaPlaceholder":"（在这里写下想法）","currentPlan":"当前计划书：","myIdea":"我的想法：","extraNotes":"补充说明：","promptRules":["请把下面的内容整理成「计划书」，按给定格式输出一份完整的 Markdown。","","要求：","1. 只用我说过的内容。我没说的，在它所在的位置写「待补：缺什么」，不要另开一栏。","2. 一次给出完整草稿，不分批。","3. 用法、界面上的东西、怎么才算做好，都是一行写完：一步 → 一步。","4. 我不懂代码，计划书里只写我想要的结果，不写实现方式。","5. 先做什么、怎么实现由你来定，另外写成做法给我确认，不放进计划书。","6. 回复末尾列出缺口：编号、位置、缺什么、建议、一个具体的默认值。建议只写在回复里，我确认后才写进计划书。","7. 我最初说的话原样放在文末「最初的描述」；平时不读这一节，需要核对我的原意时才读。","","格式："],"feedback":{"page":"页面：","element":"我指的东西：","styles":"它现在的样式：","shot":"截图：","placeholder":"（在这里写想怎么改）","errors":"页面最近的报错："},"fieldHeader":"字段","listSep":"、"},"cli":{"not_found":"找不到：{path}","file_label":"文件：{path}","project_label":"项目：{name}","unnamed":"（未命名）","status_label":"状态：{state}","no_status_line":"（没有状态行）","counts":"页面 {pages} 个，功能 {features} 个","tbd_count":"待补：{n} 处","tbd_line":"  第 {line} 行　{text}","dup_page":"页面重名：{name}","dup_feature":"功能重名：{name}","approved_but_tbd":"状态是已通过，但还有待补","problem":"问题：{text}","verdict_ok":"结论：没有待补，确认后可以开始做。","verdict_no":"结论：还不能开始做。","progress_total":"已完成 {done} / {total}","progress_states":"进度只能是 todo、doing、done","no_such_feature":"没有这个功能：{name}","progress_updated":"已更新：{name} → {status}","window_check_failed":"无法检查已打开的窗口：{why}","service_not_started":"桌面服务没有启动。","window_raised":"小窗口已经打开，已移到最前面。","no_browser":"没有找到 Edge 或 Chrome，请直接打开：{url}","opened":"已打开：{url}","usage":"用法：node shupian.mjs check [计划书] | progress [计划书] [功能名 todo|doing|done] | issues [计划书] | issue [计划书] <序号> todo|doing|done | snapshot [计划书] | app [hub|plan]","app_needs_repo":"桌面窗口属于完整的工具（桌面版或整个仓库），这一份只带命令行。","build_missing_keys":"构建失败：代码里用到了语言文件里没有的键：","build_unused_keys":"构建失败：语言文件里有没人用的键：","build_text_in_code":"构建失败：代码里写了中文字符串，文字要放进语言文件：","build_banned":"构建失败：发布物里出现不允许的内容：{what}","csc_not_found":"找不到 csc.exe（.NET Framework 4）。只能在 Windows 上生成桌面版。","ports_busy":"端口都被占用了：{why}","issue_line":"{n}. [{state}] {feature}：{text}","issue_todo":"待处理","issue_doing":"处理中","issue_done":"已修","no_issues":"没有问题记录。","no_such_issue":"没有第 {n} 条问题","issue_states":"状态只能是 todo、doing、done","issue_updated":"已更新：第 {n} 条 → {state}","no_feature_list_yet":"还没有功能清单：开始做之后才会生成。","snapshot_saved":"已把功能清单当前的内容存成一份历史版本。","snapshot_not_needed":"功能清单没有变化，不需要再存。"},"exe":{"show_window":"显示窗口","exit":"退出","tray_running":"已在托盘运行，按 Ctrl+Alt+S 打开。","tray_hotkey_taken":"已在托盘运行。快捷键 Ctrl+Alt+S 被占用，请点击托盘图标打开。","tray_hidden":"托盘图标在任务栏右下角「^」里，可以拖到任务栏上固定显示。"}}};
const SCHEMA = {"zh":{"fields":{"1":[{"name":"项目描述","purpose":"要做的东西，一两句话","how":"一个计时器，工作 25 分钟、休息 5 分钟，轮流提醒","options":[]},{"name":"使用对象","purpose":"使用的人，以及使用的时机","how":"需要专心做事的人，坐在电脑前的时候","options":[]},{"name":"使用结果","purpose":"使用之后得到的结果","how":"知道今天专心做了几轮","options":[]}],"2":[{"name":"使用流程","purpose":"每种用法一行：用的人做什么 → 看到什么 → 再做什么","how":"开始一轮：点「开始」→ 看到倒计时 → 时间到听到提示音","options":[]}],"3":[{"name":"页面用途","purpose":"用的人在这里做什么","how":"查看倒计时，开始或暂停","options":[]},{"name":"页面元素","purpose":"页面上的每一样东西，一行一个：名字：它是什么；点击或触碰后会怎样","how":"开始按钮：开始倒计时；点击后变成「暂停」","options":[]},{"name":"进入方式","purpose":"从哪里进入","how":"一打开就是它","options":[]}],"4":[{"name":"功能说明","purpose":"这件事是什么，一句话","how":"按设定的分钟数倒计时","options":[]},{"name":"验收标准","purpose":"每种情况一行：某种情况：应该出现什么","how":"设成 25 分钟点开始：每秒减一，到 0 时提示","options":[]},{"name":"限制条件","purpose":"数字范围，以及不允许出现的情况","how":"分钟数只能是 1 到 120","options":[]},{"name":"进度","purpose":"未做、进行中、已完成，AI 完成后自动更新","how":"未做","options":[]},{"name":"问题","purpose":"制作过程中发现的问题，一行一个，修好后标注「已修」","how":"点暂停后数字仍在走","options":[]}],"5":[{"name":"信息","purpose":"每种一行：名字：包含什么；下次打开是否保留","how":"设置：工作分钟数、休息分钟数；保留","options":[]}],"6":[{"name":"视觉风格","purpose":"风格、颜色、气氛","how":"白底、简洁、像笔记本","options":[]},{"name":"参考对象","purpose":"希望参考的产品或样式，写名称即可","how":"像系统自带的计时器","options":[]},{"name":"禁止出现","purpose":"一定不能出现的内容","how":"不要广告，不要打断操作的弹窗","options":[]}],"7":[{"name":"使用平台","purpose":"在哪些平台上使用","how":"网页、手机应用","options":["网页","手机应用","电脑软件","小程序","命令行","游戏机"]},{"name":"应用类型","purpose":"属于哪一类","how":"工具","options":["工具","游戏","内容展示","管理后台","社交","其他"]},{"name":"界面语言","purpose":"界面需要提供的语言","how":"中文、英文","options":["中文","英文","其他"]},{"name":"素材来源","purpose":"图片、文字、声音分别由谁提供，或交给 AI 绘制、撰写","how":"提示音使用免费素材，图标由 AI 绘制","options":[]},{"name":"账号与登录","purpose":"使用者是否需要注册","how":"不需要","options":["不需要","需要"]},{"name":"其他要求","purpose":"其他补充内容","how":"无","options":[]}]},"planTemplate":"# 计划书：〈项目名〉\r\n\r\n状态：草稿　　更新：〈日期〉\r\n\r\n## 1 基础信息\r\n\r\n项目描述：\r\n使用对象：\r\n使用结果：\r\n\r\n## 2 使用流程\r\n\r\n〈每种用法写一行：用的人做什么 → 看到什么 → 再做什么〉\r\n\r\n## 3 页面\r\n\r\n### 3.1 〈页面名〉\r\n\r\n页面用途：\r\n页面元素：\r\n- 〈东西的名字〉：它是什么；点了或碰了会怎样\r\n进入方式：\r\n\r\n## 4 功能\r\n\r\n### 4.1 〈功能名〉\r\n\r\n功能说明：\r\n验收标准：\r\n- 〈某种情况〉：应该出现什么\r\n限制条件：\r\n进度：未做\r\n\r\n## 5 需要保存的信息\r\n\r\n- 〈信息的名字〉：包含什么；下次打开还要不要在\r\n\r\n## 6 风格\r\n\r\n视觉风格：\r\n参考对象：\r\n禁止出现：\r\n\r\n## 7 使用环境与要求\r\n\r\n使用平台：\r\n应用类型：\r\n界面语言：\r\n素材来源：\r\n账号与登录：\r\n其他要求：\r\n\r\n## 最初的描述\r\n\r\n〈把最初说的话原样放在这里。AI 平时不读这一节，需要核对原意时才读。〉\r\n\r\n---\r\n\r\n缺的内容在原位写「待补：缺什么」，不另开一栏。\r\n","changeTemplate":"# 修改单：〈一句话标题〉\n\n状态：整理中　　更新：〈日期〉\n\n类型：Bug / 加功能 / 调整\n哪个界面或功能：〈只写知道的那一层〉\n我看到：\n我想要：\n怎么出现的：\n同类检查：已查\n记录：〈AI 转化时放你的原话和对应到计划书哪里〉\n\n---\n\n通过 = AI 把修改对应到计划书并补完，并且你确认过。通过之后才改。\n","example":"# 计划书：prompt 计划书助手\n\n状态：整理中　　更新：2026-10-15\n\n## 1 基础信息\n\n项目描述：新项目计划书的书写模板。在页面里按提示填写，AI 据此制作，制作过程中可以随时查看进度和问题。\n使用对象：用 AI 制作东西的人，不要求懂代码，做的可能是网页、应用、游戏或其他。\n使用结果：一份 AI 可以直接照着做的计划书，以及开始制作后独立出来、随时更新的功能清单。\n\n## 2 使用流程\n\n写计划书：把想法交给 AI → AI 写出计划书 → 在页面里查看并直接修改 → 没有待补并确认后开始制作\n自己填：新建空白计划书或查看示例 → 点击每一块，按框内提示填写 → 补完待补 → 确认\n看进度：开始制作后打开功能清单 → 看到每个功能的进度和未处理的问题 → AI 完成一个功能后，进度自动更新\n写问题：在窗口最下面的输入框写下问题（可以多行），输入 @ 可以换功能，或在网页上打开悬浮窗 → 点提交 → AI 读取并修复\n找文件夹：按桌面快捷键 → 屏幕右下角弹出小窗口，列出最近使用的文件夹 → 复制地址在命令行中打开，或打开它的计划书\n标记要改的位置：在制作中的页面上打开小窗 → 选取元素、框选区域或记录当前页面 → 写一句说明 → 复制给 AI\n\n## 3 页面\n\n### 3.1 计划书页\n\n页面用途：开始制作之前是计划书，开始制作之后另有一份功能清单，初始计划书不再改。查看和修改内容，查看每个功能的进度和问题。\n页面元素：\n- 标签：每个打开的项目一个标签，可以关闭，也可以再添加；桌面版多一个「最近」标签\n- 项目情况或功能清单：每个功能做什么、进度、未处理的问题；功能清单只列已经做出来的功能，还没做的收起在下面；点功能名选中它，在窗口最下面的输入框写问题\n- 每一块内容：点击后变成大填写框，点击框外保存；框内显示这一块该写什么和示例\n- 待补数量：点击后跳到下一处\n- 确认并开始：没有待补时确认\n- 语言：下拉选择中文或 English\n- 更多：目录、复制全文、导出、查看示例、新建、导入、连接文件夹、下载桌面版\n进入方式：打开网页；或在「最近」里点击某个文件夹的「打开计划书」\n\n### 3.2 最近\n\n页面用途：列出最近使用的文件夹，一键打开计划书或复制地址。\n页面元素：\n- 正在使用的文件夹：最近有活动的，标注「使用中」\n- 最近使用的、连接过的文件夹：每个显示完整地址和进度\n- 打开计划书：在新标签中打开\n- 地址文字：点击复制完整地址，没有单独的复制按钮\n- 新建计划书：先写计划书，写好以后再存进文件夹\n- 新建文件夹：选择放在哪里，起名字，创建后打开\n- 选择别的文件夹：弹出系统的文件夹选择窗口\n- 把文件夹直接拖进窗口，也可以打开\n进入方式：桌面快捷键，或计划书页里的「最近」标签\n\n### 3.3 标记要修改的位置（小悬浮窗）\n\n页面用途：在制作中的页面上标记要修改的位置，生成一段可以直接发给 AI 的文字。\n页面元素：\n- 选取元素：点击页面上的一个元素，记录它的位置、文字和样式\n- 区域截图：在页面上框选一块区域，保存为图片\n- 当前页面：一次记录当前页面的地址、标题、窗口大小、可见的标题和按钮，并保存整页截图\n- 修改说明：写明需要修改的内容\n- @ 功能：装了浏览器扩展并打开过桌面小窗口时，选择问题属于哪个功能，输入 @ 可以切换，计划书也可以切换\n- 记到计划书：把问题直接记进所选功能下面\n- 复制文字、复制截图：复制出去发给 AI\n进入方式：制作中的页面里的薯片按钮，或 Alt+Shift+S\n\n## 4 功能\n\n### 4.1 查看与修改\n\n功能说明：把计划书显示成可读的页面，点击任何一块即可直接修改，随时允许修改。\n验收标准：\n- 点击一块，改完点击框外：保存并显示\n- 添加页面或功能：填写名称，为空或重名时提示，成功后出现一组空字段\n- 删除页面或功能：可以撤销\n- 开始制作之后：功能清单是独立的一份，后面的修改和进度都记在功能清单里；初始计划书保持确认时的样子，只读\n- 有固定选项的字段（使用平台、应用类型、界面语言、账号与登录）：编辑时在填写框上方给出可点选的选项，可以多选\n限制条件：页面名和功能名不重名；编号只增不重排\n进度：已完成\n\n### 4.2 项目情况与功能清单\n\n功能说明：显示每个功能做什么、做到哪一步；开始制作之后生成独立的功能清单，可以在功能下记录问题。\n验收标准：\n- 功能块里写了进度：按未做、进行中、已完成显示，并统计各有几个\n- AI 或其他编辑器修改了计划书文件：页面几秒内自动更新，不需要刷新\n- 点击进度：在三种之间切换并写回计划书\n- 开始制作之后：出现「功能清单」和「初始计划书」两个页签，打开先看功能清单\n限制条件：没写进度的按未做计算\n进度：已完成\n\n### 4.3 写问题\n\n功能说明：在功能清单里给功能记录问题，AI 读取后逐条处理，处理状态在页面上实时显示。\n验收标准：\n- 窗口最下面的输入框：用列表写问题，点「添加一条」或回车加一条，每条可以 @ 多个功能，写完随时可以改，点提交记到所选功能下面\n- 添加：问题写入各自功能块的「问题」下，带日期；一条问题 @ 了几个功能，就记到每个功能下；记问题、改进度不改变已通过的状态\n- 状态：每条问题有待处理、处理中、已修三种，点击切换；AI 处理时页面实时变化，已修的留在列表里并划掉\n- 点击问题文字：直接修改和补充\n- 删除：可以撤销\n限制条件：问题只记文字，不带图片\n进度：已完成\n\n### 4.4 标签页\n\n功能说明：一个窗口里同时打开多个项目，用标签切换；桌面版多一个「最近」标签。\n验收标准：\n- 在「最近」里点击打开计划书：新开一个标签，不覆盖别的\n- 关闭标签：不丢内容，之后可以从「更多」里再次打开\n- 刷新页面：打开的标签和当前标签都保留\n限制条件：标签放不下时换行，每个标签都完整显示\n进度：已完成\n\n### 4.5 最近的文件夹\n\n功能说明：列出最近使用的文件夹，不用每次手动查找；复制地址方便在命令行中打开。\n验收标准：\n- 桌面快捷键打开：最近使用的文件夹排在最前，点击即可打开它的计划书\n- 每个文件夹的地址文字点击即可复制；点框里别处打开它的计划书\n- 新建计划书：直接得到空白计划书，状态行有「保存到文件夹」，可选已有文件夹或新建文件夹；文件夹里已有计划书时让用户选用哪一份，不直接覆盖\n- 新建文件夹：先选位置，再填名称，重名或名称不合法时说明原因\n- 拖入文件夹：按名字和里面的文件找到它的地址并打开；找不到地址时也能打开和保存，只是不能复制地址，并给出说明\n- 页面里修改了计划书：自动保存进文件夹；文件夹里被修改：自动读入页面；两边都改了：弹窗让用户选择\n限制条件：「使用中」按最近的活动推测，不一定是当前窗口；没有桌面版时使用浏览器自带的文件夹选择，仅支持电脑版 Chrome 和 Edge\n进度：已完成\n\n### 4.6 标记要修改的位置（小悬浮窗）\n\n功能说明：标记页面上要修改的位置、框选区域、记录当前页面，合成一段可以直接发给 AI 的文字。\n验收标准：\n- 选取元素：记录它的路径、文字、尺寸和样式\n- 区域截图：窗口先隐藏，拖动选择区域，保存为图片；装了浏览器扩展时使用真实截图，否则标注为伪截图\n- 当前页面：一次记录地址、标题、窗口大小、可见的标题和按钮文字、最近的报错，并保存整页截图\n- 复制文字：文字里带页面地址、窗口大小、元素、样式、修改说明和报错\n- 记到计划书：问题加上页面地址和元素，写进所选功能的「问题：」下面；桌面小窗口没打开时说明原因，仍可复制文字\n- 页面自己引入了脚本又装了扩展时，只留一个悬浮窗\n限制条件：伪截图里跨域的图片和字体显示为空白；记到计划书需要浏览器扩展和打开过的桌面小窗口\n进度：已完成\n\n### 4.7 导入、导出、复制和示例\n\n功能说明：把计划书带进、带出页面，并提供示例。\n验收标准：\n- 复制全文、复制提示词：浏览器不允许写入剪贴板时，弹出全文框，手动复制\n- 导出：得到 md 文件，文件名带日期时间\n- 导入：整份替换，可以撤销；识别不出格式时原文放入「未识别」\n- 查看示例：载入当前语言的示例，就是这份计划书本身\n限制条件：导出再导入内容不变；没填的字段导出时写「待补：缺……」\n进度：已完成\n\n### 4.8 确认检查\n\n功能说明：统计还有几处待补，确认后把状态改成已通过。\n验收标准：\n- 还有待补时点击确认：提示数量，状态不变\n- 没有待补时点击确认：状态变成已确认，还没开始制作时仍然是更新计划书\n限制条件：确认之前不开始制作\n进度：已完成\n\n### 4.9 桌面版和快捷键\n\n功能说明：不用先打开网站，按快捷键就在屏幕右下角弹出小窗口；网页里可以下载桌面版。\n验收标准：\n- 桌面版是一个 exe：双击后在托盘待命，快捷键 Ctrl+Alt+S 弹出小窗口\n- 小窗口贴在屏幕右下角\n- 网页的「更多」里有「下载桌面版」，从自己的站点下载\n- 没有桌面版时，用 start.bat 启动，用 start-debug.bat 调试\n限制条件：仅限 Windows；exe 没有数字签名，第一次运行系统会提示\n进度：进行中\n\n### 4.10 中英文\n\n功能说明：界面、模板、字段说明、示例、提示词都有中文和英文。\n验收标准：\n- 界面语言用下拉选择，默认跟随浏览器\n- 新建的计划书按当前界面语言使用对应模板\n- 中文和英文的计划书都能读取，都能统计待补和进度\n限制条件：文字放在每种语言各一个的语言文件里，代码里只有键；键缺少或没人用、代码里出现中文字符串时构建失败\n进度：已完成\n\n### 4.11 AI 说明和命令行\n\n功能说明：让 AI 不打开网页就能检查计划书、更新进度、处理问题。\n验收标准：\n- 检查：输出状态、待补位置、重名；没有待补时退出码为 0\n- 更新进度：按功能名写回计划书\n- 问题：列出所有问题（带序号和状态），按序号把一条标成处理中或已修\n- AI 说明：包含整理计划书、更新进度、处理问题、默认解耦的架构\n进度：已完成\n\n### 4.12 扩展里的真实截图\n\n功能说明：装了浏览器扩展后，截图使用浏览器自带的真实截图。\n验收标准：\n- 在 Chrome 里点击区域截图：附图标注为「截图」\n限制条件：需要在真实的 Chrome 里确认一次\n进度：进行中\n\n## 5 需要保存的信息\n\n- 计划书：一份 md，含状态；刷新后保留；可以有多个项目\n- 打开的标签：哪些项目开着、当前是哪个；刷新后保留\n- 文件夹授权和连接历史：连接过的文件夹；刷新后保留\n- 悬浮窗位置：窗口和按钮的位置；刷新后保留\n\n## 6 风格\n\n视觉风格：黑白、简洁、白底，内容放在中间一条列里，窗口小的时候不拥挤\n参考对象：无\n禁止出现：不要打断操作的弹窗，不要出现必须懂代码才能理解的内容，不要使用虚线\n\n## 7 使用环境与要求\n\n使用平台：网页、电脑软件（仅限 Windows）\n应用类型：工具\n界面语言：中文和英文\n素材来源：图标用代码绘制\n账号与登录：不需要\n其他要求：架构默认解耦，模块之间只通过接口通信\n"},"en":{"fields":{"1":[{"name":"Description","purpose":"The thing being made, in one or two sentences","how":"A timer that counts 25 minutes of work and 5 minutes of rest, over and over","options":[]},{"name":"Intended users","purpose":"Who uses it, and when","how":"People who need to focus, sitting at a computer","options":[]},{"name":"Outcome","purpose":"The result after using it","how":"They know how many rounds they focused today","options":[]}],"2":[{"name":"Usage flow","purpose":"One line each: the user does something → sees something → does the next thing","how":"Start a round: click Start → see the countdown → hear a sound when time is up","options":[]}],"3":[{"name":"Page purpose","purpose":"What the user does here","how":"Watch the countdown, start or pause it","options":[]},{"name":"Page elements","purpose":"One line per item: name: what it is; what happens when it is clicked or touched","how":"Start button: starts the countdown; turns into Pause","options":[]},{"name":"Entry point","purpose":"Where the user comes from","how":"It is the first thing they see","options":[]}],"4":[{"name":"Feature description","purpose":"What this one thing is, in one sentence","how":"Counts down the set number of minutes","options":[]},{"name":"Acceptance criteria","purpose":"One line per situation: a situation: what should happen","how":"Set 25 minutes and click Start: it drops by one each second and alerts at 0","options":[]},{"name":"Constraints","purpose":"Number ranges and what must not happen","how":"Minutes must be from 1 to 120","options":[]},{"name":"Progress","purpose":"Not started, In progress or Done; the AI updates it when finished","how":"Not started","options":[]},{"name":"Issues","purpose":"Problems found while building, one per line; marked \"Fixed\" once repaired","how":"The number keeps counting after Pause","options":[]}],"5":[{"name":"Information","purpose":"One per line: name: what it contains; whether it is kept for next time","how":"Settings: work minutes, rest minutes; kept","options":[]}],"6":[{"name":"Visual style","purpose":"Style, colours, mood","how":"White background, simple, like a notebook","options":[]},{"name":"References","purpose":"A product or look to refer to; a name is enough","how":"Like the timer that comes with the system","options":[]},{"name":"Exclusions","purpose":"Content that must never appear","how":"No ads, no pop-ups that interrupt","options":[]}],"7":[{"name":"Platform","purpose":"The platforms it is used on","how":"Web, phone app","options":["Web","phone app","desktop software","mini program","command line","game console"]},{"name":"Application type","purpose":"The kind of thing it is","how":"Tool","options":["Tool","game","content display","admin panel","social","other"]},{"name":"Interface languages","purpose":"The languages the interface needs","how":"Chinese, English","options":["Chinese","English","other"]},{"name":"Asset sources","purpose":"Who supplies images, texts and sounds, or whether the AI draws or writes them","how":"A free sound effect; the AI draws the icon","options":[]},{"name":"Accounts and sign-in","purpose":"Whether users have to register","how":"Not needed","options":["Not needed","needed"]},{"name":"Other requirements","purpose":"Other additions","how":"None","options":[]}]},"planTemplate":"# Plan: 〈Project name〉\r\n\r\nStatus: Draft　　Updated: 〈date〉\r\n\r\n## 1 Basics\r\n\r\nDescription:\r\nIntended users:\r\nOutcome:\r\n\r\n## 2 Usage flow\r\n\r\n〈One line per way of using it: the user does something → sees something → does the next thing〉\r\n\r\n## 3 Pages\r\n\r\n### 3.1 〈Page name〉\r\n\r\nPage purpose:\r\nPage elements:\r\n- 〈Name of a thing〉: what it is; what happens when it is clicked or touched\r\nEntry point:\r\n\r\n## 4 Features\r\n\r\n### 4.1 〈Feature name〉\r\n\r\nFeature description:\r\nAcceptance criteria:\r\n- 〈A situation〉: what should happen\r\nConstraints:\r\nProgress: Not started\r\n\r\n## 5 Information to keep\r\n\r\n- 〈Name of the information〉: what it contains; whether it should still be there next time\r\n\r\n## 6 Style\r\n\r\nVisual style:\r\nReferences:\r\nExclusions:\r\n\r\n## 7 Environment and requirements\r\n\r\nPlatform:\r\nApplication type:\r\nInterface languages:\r\nAsset sources:\r\nAccounts and sign-in:\r\nOther requirements:\r\n\r\n## Original description\r\n\r\n〈Put the first words here, unchanged. The AI does not read this section unless it needs to check the original intent.〉\r\n\r\n---\r\n\r\nAnything missing is written in place as \"TBD: what is missing\". There is no separate list.\r\n","changeTemplate":"# Change: 〈One-line title〉\n\nStatus: In progress　　Updated: 〈date〉\n\nType: Bug / Feature / Tweak\nWhich screen or feature: 〈Only the level you know〉\nWhat I see:\nWhat I want:\nHow it happens:\nSimilar cases checked: Yes\nRecord: 〈The AI puts your original words and where they map to in the plan here〉\n\n---\n\nApproved = the AI has mapped the change onto the plan and filled the gaps, and you have confirmed it. Changes are made only after that.\n","example":"# Plan: Prompt plan helper\n\nStatus: In progress　　Updated: 2026-10-15\n\n## 1 Basics\n\nDescription: A writing template for the plan of a new project. The plan is filled in on a page, an AI builds from it, and progress and issues can be checked at any time while it is built.\nIntended users: People who build things with an AI and do not need to know code; the thing may be a website, an app, a game or something else.\nOutcome: A plan an AI can follow directly, and a separate feature list that is kept up to date once building starts.\n\n## 2 Usage flow\n\nWrite the plan: give the idea to the AI → the AI writes the plan → read and edit it on the page → once nothing is TBD and it is confirmed, building starts\nFill it in yourself: start a blank plan or view the example → click each block and follow the hints in the box → fill in what is TBD → confirm\nCheck progress: once building has started, open the feature list → see the progress of each feature and its open issues → progress updates by itself when the AI finishes a feature\nReport an issue: write it in the input at the bottom of the window (several lines allowed), type @ to switch feature, or use the floating window on a web page → press Submit → the AI reads it and fixes it\nFind a folder: press the desktop shortcut → a small window opens at the bottom right of the screen listing recent folders → copy the path to open it in a command line, or open its plan\nMark what to change: open the small window on the page being built → pick an element, select a region or record the current page → write one line → copy it to the AI\n\n## 3 Pages\n\n### 3.1 Plan page\n\nPage purpose: Before building starts it is the plan; once building starts there is a separate feature list and the initial plan no longer changes. View and edit the content, and see the progress and issues of each feature.\nPage elements:\n- Tabs: one per open project, which can be closed and added; the desktop version has an extra \"Recent\" tab\n- Project status or feature list: what each feature does, its progress and open issues; the feature list shows what is already built and folds what is not built yet; click a feature name to choose it, then write the issue in the input at the bottom of the window\n- Each block of content: click it to turn it into a large box, click outside to save; the box shows what the block should say, with an example\n- Count of items still to fill in: click to jump to the next one\n- Confirm and start: confirms once nothing is TBD\n- Language: a drop-down to choose 中文 or English\n- More: contents, copy everything, export, view the example, new, import, connect a folder, download the desktop version\nEntry point: opening the web page, or \"Open plan\" for a folder under \"Recent\"\n\n### 3.2 Recent\n\nPage purpose: Lists the recently used folders, with one click to open the plan or copy the path.\nPage elements:\n- Folders in use: those with recent activity, marked \"In use\"\n- Recent and connected folders: each with its full path and progress\n- Open plan: opens it in a new tab\n- Copy path: copies the full path, with \"Handy for opening a CLI\" beside it\n- Choose another folder: opens the system folder picker\nEntry point: the desktop shortcut, or the \"Recent\" tab on the plan page\n\n### 3.3 Mark what to change (small floating window)\n\nPage purpose: Marks what to change on the page being built and produces text that can be sent straight to an AI.\nPage elements:\n- Pick an element: click an element on the page to record its position, text and styles\n- Region screenshot: select a region on the page and save it as an image\n- Current page: records the address, title, window size, visible headings and buttons in one click and saves a screenshot of the whole view\n- Change description: what needs to change\n- Copy text, Copy screenshot: copy them out and send them to the AI\nEntry point: the chip button on the page being built, or Alt+Shift+S\n\n## 4 Features\n\n### 4.1 View and edit\n\nFeature description: Shows the plan as a readable page; clicking any block edits it in place, and it can be changed at any time.\nAcceptance criteria:\n- Click a block, edit it, click outside: it is saved and shown\n- Add a page or feature: enter a name; an empty or duplicate name is rejected; on success a set of empty fields appears\n- Delete a page or feature: it can be undone\n- Edit a confirmed plan before building starts: the status stays Confirmed\nConstraints: page and feature names are unique; numbers only grow and are never renumbered\nProgress: Done\n\n### 4.2 Project status and feature list\n\nFeature description: Shows what each feature does and how far it is; once building starts a separate feature list is created where issues can be recorded under a feature.\nAcceptance criteria:\n- A feature block has a progress line: shown as Not started, In progress or Done, with a count of each\n- The AI or another editor changes the plan file: the page updates within a few seconds without a refresh\n- Click a progress label: it cycles through the three and is written back to the plan\n- After building starts: two tabs, \"Feature list\" and \"Initial plan\", and the feature list opens first\nConstraints: a feature without a progress line counts as Not started\nProgress: Done\n\n### 4.3 Report an issue\n\nFeature description: Records an issue under a feature in the feature list; the AI reads it and fixes it, and it is then marked \"Fixed\".\nAcceptance criteria:\n- The input at the bottom of the window: write issues as a list, press \"Add another\" or Enter for another line, each line can @ several features, press Submit to record them under the chosen features\n- Add: the issue is written under \"Issues\" in that feature block, with the date\n- Fixed: clicking it prefixes the issue with \"Fixed:\" and removes it from the open list\n- Delete: it can be undone\nConstraints: an issue is text only, without pictures\nProgress: Done\n\n### 4.4 Tabs\n\nFeature description: Several projects are open in one window and switched with tabs; the desktop version has an extra \"Recent\" tab.\nAcceptance criteria:\n- \"Open plan\" under \"Recent\": opens a new tab without replacing another\n- Close a tab: nothing is lost, and it can be reopened later from \"More\"\n- Refresh the page: the open tabs and the current tab are kept\nConstraints: when the tabs do not fit they scroll sideways and do not wrap\nProgress: Done\n\n### 4.5 Recent folders\n\nFeature description: Lists the recently used folders so they need not be looked up by hand; copying the path makes it easy to open in a command line.\nAcceptance criteria:\n- Opened with the desktop shortcut: recently used folders come first and one click opens their plan\n- Each folder has \"Copy path\", with \"Handy for opening a CLI\" beside it\n- The plan is changed on the page: it is saved into the folder; it is changed in the folder: it is read into the page; changed in both: a dialog asks which to keep\nConstraints: \"In use\" is inferred from recent activity and is not necessarily the current window; without the desktop version the browser's own folder picker is used, which only works in Chrome and Edge on a computer\nProgress: Done\n\n### 4.6 Mark what to change (small floating window)\n\nFeature description: Marks what to change on a page, selects a region and records the current page, and produces text that can be sent straight to an AI.\nAcceptance criteria:\n- Pick an element: its path, text, size and styles are recorded\n- Region screenshot: the window hides first, a region is dragged out and saved as an image; with the browser extension a real screenshot is used, otherwise it is labelled as a pseudo screenshot\n- Current page: the address, title, window size, visible headings and button text and recent errors are recorded in one click, together with a screenshot of the whole view\n- Copy text: the text carries the page address, window size, element, styles, change description and errors\nConstraints: cross-origin images and fonts appear blank in a pseudo screenshot\nProgress: Done\n\n### 4.7 Import, export, copy and example\n\nFeature description: Brings the plan into and out of the page, and provides an example.\nAcceptance criteria:\n- Copy everything, copy prompt: when the browser does not allow writing to the clipboard, a box with the full text opens for copying by hand\n- Export: gives a md file whose name carries the date and time\n- Import: replaces the whole plan and can be undone; when the format is not recognised the original text goes under \"Not recognised\"\n- View example: loads the example in the current language, which is this plan itself\nConstraints: export followed by import gives the same content; fields left empty are written as \"TBD: missing ...\" on export\nProgress: Done\n\n### 4.8 Confirmation check\n\nFeature description: Counts what is still TBD and, once confirmed, changes the status to approved.\nAcceptance criteria:\n- Confirm while items remain to fill in: the count is shown and the status stays\n- Confirm with nothing left to fill in: the status becomes Confirmed, and until building starts the plan is simply updated\nConstraints: building does not start before confirmation\nProgress: Done\n\n### 4.9 Desktop version and shortcut\n\nFeature description: A shortcut opens a small window at the bottom right of the screen without opening a website first; the desktop version can be downloaded from the page.\nAcceptance criteria:\n- The desktop version is one exe: after a double click it waits in the tray, and Ctrl+Alt+S opens the small window\n- The small window sits at the bottom right of the screen\n- \"More\" on the page has \"Download the desktop version\", served from the site itself\n- Without the desktop version, start.bat starts it and start-debug.bat debugs it\nConstraints: Windows only; the exe is not digitally signed, so the system warns the first time it runs\nProgress: In progress\n\n### 4.10 Chinese and English\n\nFeature description: The interface, templates, field guide, examples and prompts all exist in Chinese and English.\nAcceptance criteria:\n- The interface language is a drop-down and defaults to the browser language\n- A new plan uses the template of the current interface language\n- Chinese and English plans can both be read, with TBD and progress counted\nConstraints: the build fails when an interface string has no English entry\nProgress: Done\n\n### 4.11 AI instructions and command line\n\nFeature description: Lets an AI check the plan, update progress and handle issues without opening the page.\nAcceptance criteria:\n- Check: prints the status, where things are TBD and duplicate names; the exit code is 0 when nothing is TBD\n- Update progress: writes it back to the plan by feature name\n- AI instructions: cover organising the plan, updating progress, handling issues and a decoupled architecture by default\nProgress: Done\n\n### 4.12 Real screenshots in the extension\n\nFeature description: With the browser extension installed, screenshots use the browser's own real capture.\nAcceptance criteria:\n- Region screenshot in Chrome: the picture is labelled \"Screenshot\"\nConstraints: needs to be confirmed once in a real Chrome\nProgress: In progress\n\n## 5 Information to keep\n\n- Plan: one md including its status; kept after a refresh; there can be several projects\n- Open tabs: which projects are open and which is current; kept after a refresh\n- Folder permission and connection history: folders that were connected; kept after a refresh\n- Floating window position: the position of the window and the button; kept after a refresh\n\n## 6 Style\n\nVisual style: black and white, simple, white background, content in one centred column, uncrowded when the window is small\nReferences: none\nExclusions: no pop-ups that interrupt, nothing that needs code knowledge to understand, no dashed lines\n\n## 7 Environment and requirements\n\nPlatform: web, desktop software (Windows only)\nApplication type: tool\nInterface languages: Chinese and English\nAsset sources: the icon is drawn in code\nAccounts and sign-in: not needed\nOther requirements: the architecture is decoupled by default, with modules communicating only through interfaces\n"}};
const CSS = ":host {\n  all: initial;\n  display: block;\n  color-scheme: only light;\n  --paper: #ffffff;\n  --ink: #000000;\n  --muted: #5f5f5f;\n  --line: #d4d4d4;\n  --soft: #f6f6f6;\n  --hover: #ececec;\n  --z-pop: 60;\n  --z-modal: 40;\n  --z-toast: 50;\n  font-family: \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", \"Noto Sans CJK SC\", \"Source Han Sans SC\", sans-serif;\n}\n*, *::before, *::after { box-sizing: border-box; }\n\n.app {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  background: var(--paper);\n  color: var(--ink);\n  font-size: 16px;\n  line-height: 1.65;\n  -webkit-user-select: none;\n  user-select: none;\n  -webkit-tap-highlight-color: transparent;\n  overflow: hidden;\n}\n.app textarea, .app input { -webkit-user-select: text; user-select: text; }\n:where(.app) button { font: inherit; color: inherit; }\n.app :focus { outline: none; }\n.app :focus-visible { outline: 2px solid var(--ink); outline-offset: 1px; }\n@media (max-width: 400px) { .app { font-size: 14.5px; } }\n@media (max-width: 320px) { .app { font-size: 13px; } }\n\n/* 悬浮窗 */\n.win {\n  position: fixed;\n  z-index: 2147483000;\n  display: flex;\n  flex-direction: column;\n  width: 21em;\n  max-width: calc(100vw - 1em);\n  max-height: calc(100vh - 1em);\n  font-size: 15px;\n  background: var(--paper);\n  border: 2px solid var(--ink);\n  border-radius: 0.7em;\n  overflow: hidden;\n}\n.win .app { font-size: inherit; height: auto; flex: 1 1 auto; min-height: 0; }\n.fb-head { display: flex; align-items: center; flex: none; padding: 0.45em 0.6em 0.45em 0.8em; background: var(--soft); border-bottom: 1px solid var(--line); cursor: grab; touch-action: none; }\n.fb-head .logo { width: 1.7em; height: 1.7em; margin: 0 0.5em 0 0; }\n.fb-title { flex: 1; font-weight: 700; }\n.fb-body { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }\n.fb-foot { flex: none; padding: 0.6em 0.8em 0.1em; background: var(--soft); border-top: 1px solid var(--line); }\n.fb-sec { padding: 0.6em 0.8em 0.3em; border-top: 1px solid var(--line); }\n.fb-sec:first-child { border-top: 0; }\n.fb-sec-title { margin-bottom: 0.4em; font-weight: 700; }\n.fb-sec .row { margin-top: 0.3em; }\n.actions { display: flex; flex-wrap: wrap; gap: 0.4em; margin-bottom: 0.5em; }\n.actions .btn { flex: 1 1 auto; min-height: 2.2em; text-align: center; }\n.actions.three { display: grid; grid-template-columns: repeat(3, 1fr); }\n.actions.three .btn { padding-left: 0.2em; padding-right: 0.2em; }\n.fb-body textarea.in { margin-top: 0; }\n.chipline img.shot { width: 3.2em; height: 2.2em; object-fit: cover; border-radius: 0.3em; margin-right: 0.5em; flex: none; }\n@media (max-width: 400px) { .win { font-size: 14px; } }\n@media (max-width: 320px) { .win { font-size: 12.5px; } }\n.fab {\n  position: fixed;\n  z-index: 2147483000;\n  width: 54px;\n  height: 54px;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  cursor: pointer;\n  touch-action: none;\n}\n.fab svg { display: block; width: 100%; height: 100%; }\n\n/* 顶栏：一行，内容和正文同一条中心列 */\n.head { flex: none; border-bottom: 1px solid var(--line); background: var(--paper); }\n.head .in { display: flex; align-items: center; max-width: 46em; margin: 0 auto; padding: 0.45em 0.9em; }\n.head .in.drag { cursor: grab; touch-action: none; }\n.head .in > * + * { margin-left: 0.6em; }\n.brand { display: flex; align-items: center; flex: none; font-weight: 700; }\n.logo { display: block; width: 1.9em; height: 1.9em; margin-right: 0.5em; }\n.logo svg { display: block; width: 100%; height: 100%; }\n.tabs { display: flex; flex: none; }\n.tabs > * + * { margin-left: 0.35em; }\n.sp { flex: 1; min-width: 0; }\n.x { border: 0; background: transparent; width: 2em; height: 2em; line-height: 1; cursor: pointer; border-radius: 0.4em; font-size: 1em; flex: none; }\n.x:hover { background: var(--hover); }\n.x.more { font-size: 1.3em; font-weight: 700; }\n\n.chip { flex: none; border: 1px solid var(--line); background: var(--paper); border-radius: 2em; padding: 0.15em 0.9em; cursor: pointer; }\n.chip:hover { background: var(--hover); }\n.chip.on { background: var(--ink); color: var(--paper); border-color: var(--ink); }\n.btn { border: 1px solid var(--ink); background: var(--paper); border-radius: 0.45em; padding: 0.2em 0.85em; cursor: pointer; }\n.btn:hover { background: var(--hover); }\n.btn.primary { background: var(--ink); color: var(--paper); }\n.btn.primary:hover { background: #2b2b2b; }\n.btn.sm { padding: 0 0.55em; font-size: 0.9em; }\n.btn:disabled { border-color: var(--line); color: var(--muted); cursor: default; background: var(--paper); }\n.link { border: 0; background: transparent; padding: 0; text-decoration: underline; cursor: pointer; }\n.muted { color: var(--muted); font-size: 0.9em; }\n\n/* 正文：永远是一条居中的列 */\n.body { flex: 1; min-height: 0; overflow-anchor: none; overflow-y: auto; overscroll-behavior: contain; }\n.col { max-width: 46em; margin: 0 auto; padding: 0.8em 0.9em 4em; }\n.empty { padding: 2em 0; }\n.empty p { margin: 0 0 1em; }\n.row, .opts, .thumbs, .addrow, .statusline { display: flex; flex-wrap: wrap; align-items: center; }\n.row > *, .opts > *, .thumbs > *, .addrow > *, .statusline > * { margin: 0 0.5em 0.5em 0; }\n.row { margin-top: 0.6em; }\n.row.tight { margin-top: 0.5em; }\n\n.doc h1 { margin: 0.2em 0 0.2em; font-size: 1.6em; line-height: 1.3; }\n.title { display: block; max-width: 100%; text-align: left; border: 0; background: transparent; padding: 0; font: inherit; font-weight: 700; cursor: text; overflow-wrap: anywhere; }\n.title:hover { text-decoration: underline; }\n.doc h1 .in { font-size: 1em; font-weight: 700; }\n.statusline { margin-top: 0.4em; }\n.state { font-weight: 700; border: 1px solid var(--ink); border-radius: 0.3em; padding: 0 0.5em; }\n.state.pass { background: var(--ink); color: var(--paper); }\n\n.sec { margin-top: 1.6em; border-top: 2px solid var(--ink); padding-top: 0.4em; }\n.sec-head { display: flex; align-items: center; }\n.sec-head h2 { flex: 1; margin: 0; font-size: 1.1em; line-height: 1.4; }\n.fold { border: 0; background: transparent; cursor: pointer; width: 2em; height: 2em; border-radius: 0.4em; flex: none; }\n.fold:hover { background: var(--hover); }\n.sec.closed .sec-body { display: none; }\n\n.box { margin-top: 0.4em; padding: 0.5em 0.65em; border: 1px solid transparent; border-radius: 0.55em; cursor: text; }\n.box:hover { background: var(--soft); border-color: var(--line); }\n.box:focus-visible { border-color: var(--ink); }\n.hint-note { color: var(--muted); }\n.hint-lines { margin: 0.2em 0 0; color: var(--muted); font: inherit; font-size: 0.9em; white-space: pre-wrap; overflow-wrap: anywhere; }\n.lines > * { margin: 0.2em 0; }\n.kv { overflow-wrap: anywhere; }\n.li { display: flex; align-items: flex-start; }\n.li .mk { flex: none; color: var(--muted); min-width: 1.1em; text-align: right; margin-right: 0.45em; }\n.li .tx { flex: 1; min-width: 0; overflow-wrap: anywhere; }\n.lb { color: var(--muted); }\n\n.blk { margin-top: 0.9em; padding: 0.35em 0.7em 0.5em; border: 1px solid var(--ink); border-radius: 0.65em; }\n.blk-head { display: flex; align-items: center; }\n.blk-title { flex: 1; text-align: left; border: 0; background: transparent; padding: 0; font: inherit; font-weight: 700; cursor: text; overflow-wrap: anywhere; }\n.blk-title .no { color: var(--muted); margin-right: 0.5em; font-weight: 400; }\n.blk-head .in { flex: 1; width: auto; }\n\n.pend { background: var(--ink); color: var(--paper); border-radius: 0.25em; padding: 0 0.3em; }\n.pend.flash { outline: 3px solid var(--ink); outline-offset: 2px; }\n.ph { background: var(--hover); border-radius: 0.25em; padding: 0 0.25em; }\n.ref { border: 0; background: transparent; padding: 0; text-decoration: underline; cursor: pointer; font: inherit; }\n\n/* 填写 */\ntextarea.in, input.in {\n  display: block;\n  width: 100%;\n  min-width: 0;\n  border: 1px solid var(--line);\n  border-radius: 0.5em;\n  background: var(--paper);\n  color: var(--ink);\n  font: inherit;\n  padding: 0.45em 0.65em;\n  resize: none;\n  overflow: hidden;\n}\ntextarea.in:focus, input.in:focus { border-color: var(--ink); }\ntextarea.in.big { min-height: 9em; line-height: 1.7; }\n.addslot { margin: 0.7em 0 0.2em; }\n.addrow input.in { flex: 1 1 10em; width: auto; }\n.err { font-weight: 700; margin: 0.2em 0; }\n.err::before { content: \"× \"; }\n.hint { color: var(--muted); font-size: 0.9em; margin: 0.4em 0; overflow-wrap: anywhere; }\n.hint.pad { padding: 0.5em; }\n.p { margin: 0.4em 0; overflow-wrap: anywhere; }\n\n.field { margin: 0.9em 0; }\n.field > .fl { font-weight: 700; margin-bottom: 0.2em; }\n.opts { margin-bottom: 0.2em; }\n.chipline { display: flex; align-items: center; margin: 0.3em 0; padding: 0.15em 0.2em 0.15em 0.65em; border: 1px solid var(--line); border-radius: 0.5em; }\n.chipline span { flex: 1; min-width: 0; overflow-wrap: anywhere; }\n.thumbs { margin-top: 0.5em; }\n.thumb { position: relative; border: 1px solid var(--line); border-radius: 0.5em; padding: 0.25em; }\n.thumb img { display: block; width: 5.5em; height: 5.5em; object-fit: cover; border-radius: 0.3em; }\n.thumb .kind { display: block; text-align: center; font-size: 0.8em; color: var(--muted); }\n.thumb .btn { position: absolute; top: -0.5em; right: -0.5em; padding: 0 0.4em; background: var(--paper); }\n.list-title { margin: 1.6em 0 0.2em; padding-top: 0.4em; border-top: 2px solid var(--ink); font-size: 1.1em; }\n.card { border: 1px solid var(--line); border-radius: 0.6em; padding: 0.4em 0.4em 0.5em 0.8em; margin: 0.6em 0; }\n.card .when { flex: 1; color: var(--muted); font-size: 0.9em; }\n.card pre { margin: 0.2em 0 0; white-space: pre-wrap; overflow-wrap: anywhere; font: inherit; }\n.pos-list { border: 1px solid var(--line); border-radius: 0.5em; max-height: 14em; overflow-y: auto; overscroll-behavior: contain; margin-top: 0.4em; }\n.pos-item { display: block; width: 100%; text-align: left; border: 0; border-bottom: 1px solid var(--line); background: var(--paper); padding: 0.4em 0.65em; cursor: pointer; overflow-wrap: anywhere; }\n.pos-item:last-child { border-bottom: 0; }\n.pos-item:hover { background: var(--hover); }\n\n/* 浮层 */\n.pop { position: fixed; z-index: var(--z-pop); background: var(--paper); border: 1px solid var(--ink); border-radius: 0.55em; min-width: 11em; max-width: calc(100vw - 1em); max-height: 70vh; overflow-y: auto; overscroll-behavior: contain; padding: 0.25em; }\n.pop button { display: block; width: 100%; text-align: left; border: 0; background: var(--paper); border-radius: 0.4em; padding: 0.4em 0.75em; cursor: pointer; overflow-wrap: anywhere; }\n.pop button:hover { background: var(--hover); }\n.pop button.on { background: var(--ink); color: var(--paper); }\n.pop button:disabled { color: var(--muted); cursor: default; }\n.pop hr { border: 0; border-top: 1px solid var(--line); margin: 0.25em 0; }\n.pop .row2 { display: flex; align-items: stretch; }\n.pop .row2 button:first-child { flex: 1; }\n.pop .row2 .x { width: 2.2em; flex: none; text-align: center; }\n\n.mask { position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: var(--z-modal); background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; padding: 0.8em; }\n.modal { display: flex; flex-direction: column; width: 100%; max-width: 38em; max-height: 100%; background: var(--paper); border: 2px solid var(--ink); border-radius: 0.7em; }\n.modal-body { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 0.8em 0.9em; }\n.modal-foot { flex: none; display: flex; flex-wrap: wrap; justify-content: flex-end; padding: 0.6em 0.4em 0.1em 0.9em; border-top: 1px solid var(--line); background: var(--paper); }\n.modal-foot > * { margin: 0 0.5em 0.5em 0; }\n.modal textarea.in.big { overflow-y: auto; }\n\n.toast { position: absolute; z-index: var(--z-toast); left: 0.8em; right: 0.8em; bottom: calc(var(--composer-h, 0px) + 0.8em); margin: 0 auto; max-width: 30em; display: flex; align-items: center; background: var(--ink); color: var(--paper); border-radius: 0.55em; padding: 0.45em 0.5em 0.45em 0.85em; cursor: pointer; }\n.toast span { flex: 1; overflow-wrap: anywhere; }\n.toast .btn { background: var(--paper); color: var(--ink); border-color: var(--paper); flex: none; margin-left: 0.6em; }\n.fb .toast { bottom: 4.2em; }\n\n/* 滚动条：黑色细条，没有箭头 */\n.body::-webkit-scrollbar, .composer::-webkit-scrollbar, .pos-list::-webkit-scrollbar, .modal-body::-webkit-scrollbar, .pop::-webkit-scrollbar { width: 0.6em; height: 0.6em; }\n.body::-webkit-scrollbar-track, .composer::-webkit-scrollbar-track, .pos-list::-webkit-scrollbar-track, .modal-body::-webkit-scrollbar-track, .pop::-webkit-scrollbar-track { background: var(--paper); }\n.body::-webkit-scrollbar-thumb, .composer::-webkit-scrollbar-thumb, .pos-list::-webkit-scrollbar-thumb, .modal-body::-webkit-scrollbar-thumb, .pop::-webkit-scrollbar-thumb { background: var(--ink); border-radius: 1em; border: 0.15em solid var(--paper); }\n.body::-webkit-scrollbar-button, .composer::-webkit-scrollbar-button, .pos-list::-webkit-scrollbar-button, .modal-body::-webkit-scrollbar-button, .pop::-webkit-scrollbar-button { display: none; width: 0; height: 0; }\n@supports not selector(::-webkit-scrollbar) {\n  .body, .composer, .pos-list, .modal-body, .pop { scrollbar-width: thin; scrollbar-color: #000000 #ffffff; }\n}\n\n/* 项目情况 */\n.status-box { margin-top: 1em; border: 1px solid var(--ink); border-radius: 0.65em; padding: 0.5em 0.8em 0.6em; }\n.status-head { display: flex; align-items: baseline; flex-wrap: wrap; }\n.status-head h2 { margin: 0 0.8em 0 0; font-size: 1.05em; }\n.bar-track { display: flex; height: 0.5em; margin: 0.4em 0 0.3em; border: 1px solid var(--ink); border-radius: 1em; overflow: hidden; background: var(--paper); }\n.bar-done { background: var(--ink); }\n.bar-doing { background: #8a8a8a; }\n.status-row { display: flex; align-items: center; padding: 0.25em 0; border-top: 1px solid var(--line); }\n.bar-track + .status-row { border-top: 0; }\n.status-name { flex: 1; min-width: 0; overflow-wrap: anywhere; }\n.status-name .muted { display: block; }\n.prog { flex: none; margin-left: 0.6em; min-width: 4.4em; border: 1px solid var(--ink); border-radius: 2em; padding: 0 0.7em; background: var(--paper); cursor: pointer; }\n.prog.done { background: var(--ink); color: var(--paper); }\n.prog.doing { font-weight: 700; }\n.prog.todo { border-color: var(--line); color: var(--muted); }\n\n/* 文件夹列表 */\n.folders .ftitle { margin: 1em 0 0.3em; font-size: 0.95em; }\n.frow { display: flex; align-items: flex-start; border: 1px solid var(--line); border-radius: 0.6em; padding: 0.5em 0.6em; margin: 0.4em 0; cursor: pointer; }\n.frow:hover { background: var(--soft); }\n.frow:focus-visible { border-color: var(--ink); }\n.frow.cur { border-color: var(--ink); }\n.finfo { flex: 1; min-width: 0; }\n.fname { font-weight: 700; overflow-wrap: anywhere; }\n.badge { margin-left: 0.5em; font-weight: 400; font-size: 0.8em; border: 1px solid var(--ink); border-radius: 0.3em; padding: 0 0.35em; }\n.fpath { display: block; border: 0; background: transparent; padding: 0; font: inherit; font-size: 0.85em; text-align: left; color: var(--muted); overflow-wrap: anywhere; cursor: copy; }\n.fpath:hover { text-decoration: underline; }\n\n/* 标签 */\n.head .tabs-in { padding-top: 0; padding-bottom: 0.1em; }\n.tabbar { display: flex; flex-wrap: wrap; align-items: center; flex: 1; min-width: 0; }\n.tabbar > * { flex: none; max-width: 100%; margin: 0 0.35em 0.35em 0; }\n.tab { display: flex; align-items: center; border: 1px solid var(--line); border-radius: 0.5em; background: var(--paper); }\n.tab.on { border-color: var(--ink); background: var(--ink); color: var(--paper); }\n.tab-name { border: 0; background: transparent; padding: 0.1em 0.2em 0.1em 0.7em; cursor: pointer; text-align: left; }\n.tab-x { border: 0; background: transparent; padding: 0.1em 0.55em 0.1em 0.3em; cursor: pointer; opacity: 0.7; }\n.tab-x:hover { opacity: 1; }\n.chip.add { padding: 0.1em 0.7em; }\n.lang { flex: none; border: 1px solid var(--line); background: var(--paper); border-radius: 0.45em; padding: 0.1em 0.6em; cursor: pointer; }\n.lang:hover { background: var(--hover); }\n.menu-link { display: block; padding: 0.4em 0.75em; color: var(--ink); text-decoration: none; border-radius: 0.4em; }\n.menu-link:hover { background: var(--hover); }\n\n/* 功能清单：问题和小弹窗 */\n.modal.small { max-width: 24em; }\n.drop-text { background: var(--paper); border: 2px solid var(--ink); border-radius: 0.7em; padding: 1em 1.4em; font-weight: 700; text-align: center; }\n.plan-pick { display: block; margin: 0.2em 0; text-align: left; font-size: 0.9em; }\n.pick-row { display: block; width: 100%; text-align: left; margin-bottom: 0.4em; overflow-wrap: anywhere; }\n.status-head .btn { margin-left: auto; }\n.issue { display: flex; align-items: flex-start; margin: 0.2em 0 0.2em 1.2em; padding: 0.25em 0.5em; background: var(--soft); border-radius: 0.5em; }\n.issue-text { flex: 1; min-width: 0; margin: 0 0.5em; overflow-wrap: anywhere; }\n.issue-text.link { text-align: left; text-decoration: none; }\n.issue textarea.in { flex: 1; margin: 0 0.5em; }\n.istate { flex: none; min-width: 4.4em; }\n.istate.doing { font-weight: 700; border-width: 2px; }\n.istate.done { background: var(--ink); color: var(--paper); }\n.issue.done .issue-text { color: var(--muted); text-decoration: line-through; }\n.issue.doing { border-left: 3px solid var(--ink); }\n.issue.flash { animation: issue-done 1.4s ease-out 1; }\n@keyframes issue-done { from { background: var(--ink); } to { background: var(--soft); } }\n@media (prefers-reduced-motion: reduce) { .issue.flash { animation: none; } }\n.ilist .irow { margin: 0 0 0.5em; }\n.irow-top { display: flex; flex-wrap: wrap; align-items: center; margin-bottom: 0.2em; }\n.irow-top > * { margin-right: 0.35em; }\n.ftag { display: inline-flex; align-items: center; }\n.ftag .x { width: 1.6em; height: 1.6em; }\n.irow-top:empty { display: none; }\n.irow-top .sp { flex: 1; }\n.irow-top:not(:has(button)) { display: none; }\n.add-row { margin-bottom: 0.3em; }\n.optrows { margin-bottom: 0.5em; }\n.optrow { display: flex; flex-wrap: wrap; align-items: center; margin-bottom: 0.3em; }\n.optrow .lb { margin-right: 0.5em; }\n.optrow .chip { margin: 0 0.35em 0.3em 0; }\n.doctabs { display: flex; gap: 0.4em; margin: 0.4em 0 0.2em; }\n.box.readonly { cursor: default; }\n.hist-row { display: flex; align-items: center; justify-content: space-between; gap: 0.6em; border: 1px solid var(--line); border-radius: 0.6em; padding: 0.4em 0.6em; margin: 0 0 0.4em; }\n.hist-info { flex: 1; min-width: 0; overflow-wrap: anywhere; }\n.status-row .btn.sm { flex: none; margin-left: 0.5em; }\n.target { max-width: 100%; text-align: left; overflow-wrap: anywhere; }\n\n/* 小悬浮窗里的按钮更紧凑，三个动作放在一行 */\n.fb .btn { padding: 0.15em 0.5em; font-size: 0.92em; }\n.fb .row > * { margin-right: 0.35em; }\n.extrow { display: flex; align-items: center; justify-content: space-between; gap: 0.6em; border: 1px solid var(--line); border-radius: 0.6em; padding: 0.4em 0.6em; margin: 0 0 0.4em; }\n.extrow.wait { visibility: hidden; }\n.extrow > .muted { flex: 1; min-width: 0; overflow-wrap: anywhere; }\n.steps { margin: 0 0 0.8em; padding-left: 1.4em; line-height: 1.6; }\n.ext-block { border: 1px solid var(--line); border-radius: 0.6em; padding: 0.5em 0.7em; margin: 0 0 0.6em; }\n.ext-block h3 { margin: 0 0 0.3em; font-size: 1em; }\n.bookmarklet { display: inline-block; border: 1px solid var(--ink); border-radius: 999px; padding: 0.3em 0.9em; margin: 0.2em 0; color: var(--ink); text-decoration: none; cursor: grab; }\n\n/* 作品署名 */\n.credit { display: flex; align-items: center; gap: 0.8em; margin: 2.4em 0 0; }\n.credit-avatar { flex: none; width: 48px; height: 48px; border-radius: 0.4em; object-fit: cover; }\n.credit-text { min-width: 0; font-size: 0.9em; line-height: 1.5; color: var(--muted); overflow-wrap: anywhere; }\n\n/* 写问题：固定在窗口最下面，在滚动区之外 */\n.composer { flex: none; max-height: 45%; overflow-y: auto; overscroll-behavior: contain; border-top: 2px solid var(--ink); background: var(--paper); padding: 0.5em 0.9em 0.1em; }\n.composer-in { position: relative; max-width: 46em; margin: 0 auto; }\n.composer-submit { position: absolute; right: 0; bottom: 0.3em; }\n.later-toggle { display: block; margin: 0.5em 0 0.2em; }\n.ref.on { background: var(--ink); color: var(--paper); border-radius: 0.3em; padding: 0 0.35em; text-decoration: none; }\n\n/* 本页部件和可调参数 */\n.part-list { display: flex; flex-wrap: wrap; margin-top: 0.3em; }\n.part-list .ftag { margin: 0 0.35em 0.35em 0; }\n.part-name { flex: 1; min-width: 0; }\n.stage-row { display: flex; overflow-x: auto; overscroll-behavior: contain; scrollbar-width: none; padding-bottom: 0.3em; }\n.stage-row::-webkit-scrollbar { display: none; }\n.stage-row .chip { margin-right: 0.4em; white-space: nowrap; }\n.tune-row:last-child { margin-bottom: 0.3em; }\n.tune-row { display: flex; align-items: center; margin-top: 0.3em; }\n.tune-label { flex: none; max-width: 30%; margin-right: 0.5em; overflow-wrap: anywhere; }\n.tune-range { flex: 1; min-width: 0; margin: 0 0.5em 0 0; -webkit-appearance: none; appearance: none; height: 1.2em; background: transparent; }\n.tune-range::-webkit-slider-runnable-track { height: 2px; background: var(--ink); }\n.tune-range::-moz-range-track { height: 2px; background: var(--ink); }\n.tune-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 1em; height: 1em; margin-top: -0.5em; border-radius: 50%; border: 2px solid var(--ink); background: var(--paper); }\n.tune-range::-moz-range-thumb { width: 0.8em; height: 0.8em; border-radius: 50%; border: 2px solid var(--ink); background: var(--paper); }\ninput.tune-num { flex: none; width: 4.5em; padding: 0.1em 0.4em; }\n\n";
const ICON_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><rect width=\"512\" height=\"512\" rx=\"113\" fill=\"#e5322d\"/><g transform=\"translate(256 256) rotate(-20) scale(1.0067)\"><path d=\"M187.8 0.0L188.0 2.4L188.2 4.9L188.3 7.3L188.3 9.8L188.2 12.2L188.0 14.7L187.8 17.1L187.5 19.5L187.1 22.0L186.6 24.4L186.1 26.8L185.5 29.2L184.8 31.6L184.0 34.0L183.1 36.4L182.2 38.7L181.2 41.1L180.1 43.4L179.0 45.7L177.7 48.0L176.4 50.2L175.1 52.5L173.6 54.7L172.1 56.8L170.6 59.0L169.0 61.1L167.3 63.2L165.5 65.3L163.7 67.3L161.9 69.3L159.9 71.3L158.0 73.2L156.0 75.1L153.9 77.0L151.8 78.8L149.6 80.6L147.4 82.4L145.1 84.1L142.9 85.8L140.5 87.4L138.2 89.1L135.8 90.7L133.3 92.2L130.9 93.7L128.4 95.2L125.8 96.6L123.3 98.0L120.7 99.4L118.1 100.7L115.5 102.0L112.8 103.3L110.1 104.5L107.4 105.7L104.7 106.9L102.0 108.0L99.2 109.1L96.5 110.2L93.7 111.2L90.9 112.2L88.1 113.2L85.3 114.1L82.5 115.0L79.6 115.9L76.8 116.7L73.9 117.5L71.0 118.3L68.1 119.0L65.2 119.7L62.3 120.4L59.4 121.1L56.5 121.7L53.6 122.3L50.7 122.9L47.7 123.4L44.8 123.9L41.8 124.4L38.9 124.9L35.9 125.3L32.9 125.7L30.0 126.0L27.0 126.4L24.0 126.7L21.0 127.0L18.0 127.2L15.0 127.4L12.0 127.6L9.0 127.7L6.0 127.8L3.0 127.9L0.0 128.0L-3.0 128.0L-6.0 128.0L-9.0 127.9L-12.1 127.8L-15.1 127.7L-18.1 127.6L-21.1 127.4L-24.1 127.1L-27.1 126.9L-30.1 126.6L-33.1 126.3L-36.1 125.9L-39.1 125.5L-42.0 125.0L-45.0 124.5L-48.0 124.0L-50.9 123.4L-53.8 122.8L-56.7 122.2L-59.6 121.5L-62.5 120.8L-65.4 120.0L-68.3 119.2L-71.1 118.4L-73.9 117.5L-76.7 116.6L-79.5 115.7L-82.2 114.7L-84.9 113.6L-87.6 112.6L-90.3 111.5L-92.9 110.3L-95.6 109.1L-98.1 107.9L-100.7 106.6L-103.2 105.4L-105.7 104.0L-108.2 102.7L-110.6 101.3L-112.9 99.8L-115.3 98.4L-117.6 96.9L-119.9 95.3L-122.1 93.8L-124.3 92.2L-126.4 90.5L-128.5 88.9L-130.6 87.2L-132.6 85.5L-134.6 83.7L-136.5 82.0L-138.4 80.2L-140.3 78.4L-142.1 76.5L-143.8 74.7L-145.5 72.8L-147.2 70.9L-148.8 69.0L-150.4 67.0L-151.9 65.1L-153.4 63.1L-154.9 61.1L-156.3 59.0L-157.6 57.0L-158.9 55.0L-160.2 52.9L-161.4 50.8L-162.6 48.7L-163.7 46.6L-164.8 44.5L-165.8 42.3L-166.8 40.2L-167.8 38.0L-168.7 35.9L-169.6 33.7L-170.4 31.5L-171.1 29.3L-171.9 27.1L-172.6 24.9L-173.2 22.6L-173.8 20.4L-174.4 18.2L-174.9 15.9L-175.4 13.7L-175.8 11.4L-176.2 9.1L-176.5 6.9L-176.8 4.6L-177.1 2.3L-177.3 0.0L-177.4 -2.3L-177.5 -4.6L-177.6 -6.9L-177.6 -9.2L-177.6 -11.5L-177.5 -13.8L-177.4 -16.2L-177.3 -18.5L-177.0 -20.8L-176.8 -23.1L-176.5 -25.4L-176.1 -27.8L-175.7 -30.1L-175.2 -32.4L-174.7 -34.7L-174.1 -37.0L-173.5 -39.3L-172.8 -41.6L-172.1 -43.9L-171.3 -46.2L-170.5 -48.5L-169.6 -50.8L-168.6 -53.1L-167.6 -55.3L-166.5 -57.6L-165.4 -59.8L-164.2 -62.0L-163.0 -64.3L-161.6 -66.4L-160.3 -68.6L-158.9 -70.8L-157.4 -72.9L-155.8 -75.0L-154.2 -77.1L-152.6 -79.2L-150.8 -81.3L-149.1 -83.3L-147.2 -85.3L-145.3 -87.3L-143.4 -89.2L-141.3 -91.1L-139.3 -93.0L-137.1 -94.8L-135.0 -96.6L-132.7 -98.4L-130.4 -100.2L-128.1 -101.9L-125.7 -103.5L-123.2 -105.1L-120.7 -106.7L-118.2 -108.2L-115.6 -109.7L-113.0 -111.2L-110.3 -112.6L-107.6 -113.9L-104.8 -115.2L-102.0 -116.5L-99.1 -117.7L-96.3 -118.8L-93.4 -119.9L-90.4 -121.0L-87.5 -122.0L-84.5 -122.9L-81.4 -123.8L-78.4 -124.7L-75.3 -125.4L-72.2 -126.2L-69.1 -126.9L-66.0 -127.5L-62.9 -128.1L-59.7 -128.6L-56.6 -129.1L-53.4 -129.5L-50.2 -129.9L-47.0 -130.2L-43.9 -130.5L-40.7 -130.7L-37.5 -130.8L-34.3 -131.0L-31.2 -131.0L-28.0 -131.1L-24.8 -131.0L-21.7 -131.0L-18.5 -130.9L-15.4 -130.7L-12.3 -130.5L-9.2 -130.3L-6.1 -130.0L-3.1 -129.7L-0.0 -129.3L3.0 -128.9L6.1 -128.5L9.0 -128.0L12.0 -127.5L15.0 -127.0L17.9 -126.4L20.8 -125.8L23.7 -125.2L26.6 -124.6L29.5 -123.9L32.3 -123.2L35.1 -122.5L37.9 -121.7L40.7 -120.9L43.4 -120.1L46.1 -119.3L48.8 -118.5L51.5 -117.6L54.2 -116.7L56.8 -115.8L59.5 -114.9L62.1 -113.9L64.7 -113.0L67.2 -112.0L69.8 -111.0L72.4 -110.0L74.9 -109.0L77.4 -107.9L79.9 -106.9L82.4 -105.8L84.8 -104.7L87.3 -103.6L89.7 -102.5L92.2 -101.3L94.6 -100.2L97.0 -99.0L99.4 -97.8L101.8 -96.6L104.1 -95.4L106.5 -94.1L108.9 -92.9L111.2 -91.6L113.5 -90.3L115.8 -88.9L118.1 -87.6L120.4 -86.2L122.7 -84.8L124.9 -83.4L127.1 -82.0L129.4 -80.5L131.6 -79.0L133.7 -77.5L135.9 -75.9L138.0 -74.4L140.2 -72.8L142.2 -71.2L144.3 -69.5L146.4 -67.8L148.4 -66.1L150.4 -64.4L152.3 -62.6L154.2 -60.8L156.1 -59.0L158.0 -57.1L159.8 -55.3L161.6 -53.4L163.3 -51.4L165.0 -49.4L166.7 -47.4L168.3 -45.4L169.8 -43.4L171.3 -41.3L172.8 -39.2L174.2 -37.0L175.5 -34.9L176.8 -32.7L178.0 -30.5L179.2 -28.2L180.3 -26.0L181.3 -23.7L182.3 -21.4L183.2 -19.1L184.0 -16.8L184.8 -14.4L185.4 -12.0L186.1 -9.6L186.6 -7.3L187.1 -4.8L187.5 -2.4Z\" fill=\"#e3a400\"/><path d=\"M174.6 0.0L174.9 2.3L175.0 4.5L175.1 6.8L175.1 9.1L175.0 11.4L174.9 13.6L174.7 15.9L174.4 18.2L174.0 20.4L173.6 22.7L173.1 24.9L172.5 27.2L171.8 29.4L171.1 31.6L170.3 33.8L169.4 36.0L168.5 38.2L167.5 40.4L166.4 42.5L165.3 44.6L164.1 46.7L162.8 48.8L161.5 50.8L160.1 52.9L158.6 54.9L157.1 56.8L155.6 58.8L153.9 60.7L152.3 62.6L150.5 64.4L148.7 66.3L146.9 68.1L145.0 69.8L143.1 71.6L141.1 73.3L139.1 75.0L137.1 76.6L135.0 78.2L132.9 79.8L130.7 81.3L128.5 82.8L126.3 84.3L124.0 85.7L121.7 87.2L119.4 88.5L117.0 89.9L114.6 91.2L112.2 92.4L109.8 93.7L107.4 94.9L104.9 96.1L102.4 97.2L99.9 98.3L97.4 99.4L94.9 100.5L92.3 101.5L89.7 102.5L87.1 103.4L84.5 104.3L81.9 105.2L79.3 106.1L76.7 106.9L74.0 107.8L71.4 108.5L68.7 109.3L66.0 110.0L63.4 110.7L60.7 111.4L58.0 112.0L55.3 112.6L52.6 113.2L49.8 113.8L47.1 114.3L44.4 114.8L41.6 115.3L38.9 115.7L36.2 116.1L33.4 116.5L30.6 116.9L27.9 117.2L25.1 117.5L22.3 117.8L19.5 118.1L16.8 118.3L14.0 118.5L11.2 118.6L8.4 118.8L5.6 118.9L2.8 119.0L0.0 119.0L-2.8 119.0L-5.6 119.0L-8.4 119.0L-11.2 118.9L-14.0 118.8L-16.8 118.6L-19.6 118.5L-22.4 118.2L-25.2 118.0L-28.0 117.7L-30.8 117.4L-33.6 117.1L-36.3 116.7L-39.1 116.3L-41.8 115.8L-44.6 115.3L-47.3 114.8L-50.1 114.2L-52.8 113.6L-55.5 113.0L-58.2 112.3L-60.8 111.6L-63.5 110.9L-66.1 110.1L-68.7 109.3L-71.3 108.5L-73.9 107.6L-76.5 106.6L-79.0 105.7L-81.5 104.7L-84.0 103.7L-86.4 102.6L-88.9 101.5L-91.3 100.4L-93.6 99.2L-96.0 98.0L-98.3 96.7L-100.6 95.5L-102.8 94.2L-105.0 92.8L-107.2 91.5L-109.4 90.1L-111.5 88.6L-113.5 87.2L-115.6 85.7L-117.6 84.2L-119.5 82.7L-121.4 81.1L-123.3 79.5L-125.2 77.9L-127.0 76.2L-128.7 74.6L-130.4 72.9L-132.1 71.2L-133.8 69.5L-135.3 67.7L-136.9 65.9L-138.4 64.1L-139.9 62.3L-141.3 60.5L-142.7 58.7L-144.0 56.8L-145.3 54.9L-146.6 53.0L-147.8 51.1L-149.0 49.2L-150.1 47.3L-151.2 45.3L-152.3 43.3L-153.3 41.4L-154.2 39.4L-155.2 37.4L-156.0 35.4L-156.9 33.4L-157.7 31.3L-158.4 29.3L-159.2 27.3L-159.8 25.2L-160.5 23.1L-161.1 21.1L-161.6 19.0L-162.2 16.9L-162.6 14.8L-163.1 12.7L-163.5 10.6L-163.8 8.5L-164.2 6.4L-164.4 4.3L-164.7 2.1L-164.9 0.0L-165.0 -2.1L-165.1 -4.3L-165.2 -6.4L-165.2 -8.6L-165.2 -10.7L-165.1 -12.9L-165.0 -15.0L-164.8 -17.2L-164.6 -19.3L-164.4 -21.5L-164.1 -23.7L-163.8 -25.8L-163.4 -28.0L-163.0 -30.1L-162.5 -32.3L-161.9 -34.4L-161.4 -36.6L-160.7 -38.7L-160.0 -40.9L-159.3 -43.0L-158.5 -45.1L-157.7 -47.2L-156.8 -49.4L-155.9 -51.5L-154.9 -53.6L-153.8 -55.6L-152.7 -57.7L-151.5 -59.8L-150.3 -61.8L-149.1 -63.8L-147.7 -65.8L-146.4 -67.8L-144.9 -69.8L-143.4 -71.7L-141.9 -73.7L-140.3 -75.6L-138.6 -77.5L-136.9 -79.3L-135.1 -81.2L-133.3 -83.0L-131.4 -84.7L-129.5 -86.5L-127.5 -88.2L-125.5 -89.9L-123.4 -91.5L-121.3 -93.1L-119.1 -94.7L-116.9 -96.3L-114.6 -97.8L-112.3 -99.2L-109.9 -100.7L-107.5 -102.0L-105.1 -103.4L-102.6 -104.7L-100.0 -105.9L-97.5 -107.1L-94.8 -108.3L-92.2 -109.4L-89.5 -110.5L-86.8 -111.5L-84.1 -112.5L-81.3 -113.4L-78.5 -114.3L-75.7 -115.1L-72.9 -115.9L-70.0 -116.7L-67.2 -117.4L-64.3 -118.0L-61.4 -118.6L-58.5 -119.1L-55.5 -119.6L-52.6 -120.0L-49.7 -120.4L-46.7 -120.8L-43.7 -121.1L-40.8 -121.3L-37.8 -121.5L-34.9 -121.7L-31.9 -121.8L-29.0 -121.9L-26.0 -121.9L-23.1 -121.9L-20.2 -121.8L-17.2 -121.7L-14.3 -121.6L-11.4 -121.4L-8.6 -121.2L-5.7 -120.9L-2.8 -120.6L-0.0 -120.3L2.8 -119.9L5.6 -119.5L8.4 -119.1L11.2 -118.6L13.9 -118.1L16.7 -117.6L19.4 -117.0L22.1 -116.5L24.7 -115.9L27.4 -115.2L30.0 -114.6L32.6 -113.9L35.2 -113.2L37.8 -112.5L40.4 -111.7L42.9 -110.9L45.4 -110.2L47.9 -109.4L50.4 -108.5L52.9 -107.7L55.3 -106.8L57.7 -106.0L60.1 -105.1L62.5 -104.2L64.9 -103.2L67.3 -102.3L69.6 -101.4L72.0 -100.4L74.3 -99.4L76.6 -98.4L78.9 -97.4L81.2 -96.4L83.5 -95.3L85.7 -94.2L88.0 -93.2L90.2 -92.1L92.4 -91.0L94.7 -89.8L96.9 -88.7L99.1 -87.5L101.2 -86.4L103.4 -85.2L105.6 -83.9L107.7 -82.7L109.8 -81.5L112.0 -80.2L114.1 -78.9L116.2 -77.6L118.2 -76.2L120.3 -74.9L122.3 -73.5L124.4 -72.1L126.4 -70.6L128.4 -69.2L130.3 -67.7L132.3 -66.2L134.2 -64.6L136.1 -63.1L138.0 -61.5L139.8 -59.9L141.7 -58.2L143.4 -56.6L145.2 -54.9L146.9 -53.1L148.6 -51.4L150.3 -49.6L151.9 -47.8L153.5 -46.0L155.0 -44.1L156.5 -42.2L157.9 -40.3L159.3 -38.4L160.7 -36.4L162.0 -34.4L163.2 -32.4L164.4 -30.4L165.5 -28.3L166.6 -26.3L167.6 -24.2L168.6 -22.0L169.5 -19.9L170.3 -17.8L171.1 -15.6L171.8 -13.4L172.5 -11.2L173.0 -9.0L173.5 -6.7L174.0 -4.5L174.3 -2.3Z\" fill=\"#ffd21f\"/><path d=\"M-131.7 -70.8L-129.5 -73.0L-127.3 -75.3L-125.1 -74.6L-122.9 -73.5L-120.7 -72.4L-118.5 -71.2L-116.4 -69.7L-114.2 -68.2L-112.0 -66.4L-109.8 -64.5L-107.6 -62.4L-105.4 -60.3L-103.2 -58.0L-101.0 -56.8L-98.8 -57.8L-96.6 -58.9L-94.4 -60.1L-92.2 -61.4L-90.0 -62.9L-87.8 -64.5L-85.6 -66.4L-83.4 -68.3L-81.2 -70.4L-79.0 -72.7L-76.8 -74.9L-74.6 -74.8L-72.4 -73.7L-70.3 -72.6L-68.1 -71.4L-65.9 -70.0L-63.7 -68.4L-61.5 -66.7L-59.3 -64.8L-57.1 -62.8L-54.9 -60.6L-52.7 -58.4L-50.5 -56.7L-48.3 -57.7L-46.1 -58.7L-43.9 -59.9L-41.7 -61.2L-39.5 -62.6L-37.3 -64.3L-35.1 -66.0L-32.9 -68.0L-30.7 -70.1L-28.5 -72.3L-26.3 -74.6L-24.1 -74.9L-22.0 -73.9L-19.8 -72.8L-17.6 -71.6L-15.4 -70.2L-13.2 -68.7L-11.0 -67.0L-8.8 -65.2L-6.6 -63.1L-4.4 -61.0L-2.2 -58.8L0.0 -56.5L2.2 -57.5L4.4 -58.6L6.6 -59.7L8.8 -61.0L11.0 -62.4L13.2 -64.0L15.4 -65.7L17.6 -67.7L19.8 -69.7L22.0 -71.9L24.1 -74.2L26.3 -75.1L28.5 -74.1L30.7 -73.0L32.9 -71.8L35.1 -70.5L37.3 -69.0L39.5 -67.3L41.7 -65.5L43.9 -63.5L46.1 -61.4L48.3 -59.1L50.5 -56.9L52.7 -57.3L54.9 -58.4L57.1 -59.5L59.3 -60.7L61.5 -62.1L63.7 -63.7L65.9 -65.4L68.1 -67.3L70.3 -69.4L72.4 -71.5L74.6 -73.8L76.8 -75.3L79.0 -74.2L81.2 -73.2L83.4 -72.0L85.6 -70.7L87.8 -69.2L90.0 -67.6L92.2 -65.8L94.4 -63.8L96.6 -61.7L98.8 -59.5L101.0 -57.3L103.2 -57.2L105.4 -58.2L107.6 -59.3L109.8 -60.5L112.0 -61.9L114.2 -63.4L116.4 -65.1L118.5 -67.0L120.7 -69.0L122.9 -71.2L125.1 -73.4L127.3 -75.4L129.5 -74.4L131.7 -73.4\" fill=\"none\" stroke=\"#f0b400\" stroke-width=\"11\" stroke-linecap=\"round\"/><path d=\"M-131.7 -4.8L-129.5 -7.0L-127.3 -9.3L-125.1 -8.6L-122.9 -7.5L-120.7 -6.4L-118.5 -5.2L-116.4 -3.7L-114.2 -2.2L-112.0 -0.4L-109.8 1.5L-107.6 3.6L-105.4 5.7L-103.2 8.0L-101.0 9.2L-98.8 8.2L-96.6 7.1L-94.4 5.9L-92.2 4.6L-90.0 3.1L-87.8 1.5L-85.6 -0.4L-83.4 -2.3L-81.2 -4.4L-79.0 -6.7L-76.8 -8.9L-74.6 -8.8L-72.4 -7.7L-70.3 -6.6L-68.1 -5.4L-65.9 -4.0L-63.7 -2.4L-61.5 -0.7L-59.3 1.2L-57.1 3.2L-54.9 5.4L-52.7 7.6L-50.5 9.3L-48.3 8.3L-46.1 7.3L-43.9 6.1L-41.7 4.8L-39.5 3.4L-37.3 1.7L-35.1 -0.0L-32.9 -2.0L-30.7 -4.1L-28.5 -6.3L-26.3 -8.6L-24.1 -8.9L-22.0 -7.9L-19.8 -6.8L-17.6 -5.6L-15.4 -4.2L-13.2 -2.7L-11.0 -1.0L-8.8 0.8L-6.6 2.9L-4.4 5.0L-2.2 7.2L0.0 9.5L2.2 8.5L4.4 7.4L6.6 6.3L8.8 5.0L11.0 3.6L13.2 2.0L15.4 0.3L17.6 -1.7L19.8 -3.7L22.0 -5.9L24.1 -8.2L26.3 -9.1L28.5 -8.1L30.7 -7.0L32.9 -5.8L35.1 -4.5L37.3 -3.0L39.5 -1.3L41.7 0.5L43.9 2.5L46.1 4.6L48.3 6.9L50.5 9.1L52.7 8.7L54.9 7.6L57.1 6.5L59.3 5.3L61.5 3.9L63.7 2.3L65.9 0.6L68.1 -1.3L70.3 -3.4L72.4 -5.5L74.6 -7.8L76.8 -9.3L79.0 -8.2L81.2 -7.2L83.4 -6.0L85.6 -4.7L87.8 -3.2L90.0 -1.6L92.2 0.2L94.4 2.2L96.6 4.3L98.8 6.5L101.0 8.7L103.2 8.8L105.4 7.8L107.6 6.7L109.8 5.5L112.0 4.1L114.2 2.6L116.4 0.9L118.5 -1.0L120.7 -3.0L122.9 -5.2L125.1 -7.4L127.3 -9.4L129.5 -8.4L131.7 -7.4\" fill=\"none\" stroke=\"#f0b400\" stroke-width=\"11\" stroke-linecap=\"round\"/><path d=\"M-131.7 61.2L-129.5 59.0L-127.3 56.7L-125.1 57.4L-122.9 58.5L-120.7 59.6L-118.5 60.8L-116.4 62.3L-114.2 63.8L-112.0 65.6L-109.8 67.5L-107.6 69.6L-105.4 71.7L-103.2 74.0L-101.0 75.2L-98.8 74.2L-96.6 73.1L-94.4 71.9L-92.2 70.6L-90.0 69.1L-87.8 67.5L-85.6 65.6L-83.4 63.7L-81.2 61.6L-79.0 59.3L-76.8 57.1L-74.6 57.2L-72.4 58.3L-70.3 59.4L-68.1 60.6L-65.9 62.0L-63.7 63.6L-61.5 65.3L-59.3 67.2L-57.1 69.2L-54.9 71.4L-52.7 73.6L-50.5 75.3L-48.3 74.3L-46.1 73.3L-43.9 72.1L-41.7 70.8L-39.5 69.4L-37.3 67.7L-35.1 66.0L-32.9 64.0L-30.7 61.9L-28.5 59.7L-26.3 57.4L-24.1 57.1L-22.0 58.1L-19.8 59.2L-17.6 60.4L-15.4 61.8L-13.2 63.3L-11.0 65.0L-8.8 66.8L-6.6 68.9L-4.4 71.0L-2.2 73.2L0.0 75.5L2.2 74.5L4.4 73.4L6.6 72.3L8.8 71.0L11.0 69.6L13.2 68.0L15.4 66.3L17.6 64.3L19.8 62.3L22.0 60.1L24.1 57.8L26.3 56.9L28.5 57.9L30.7 59.0L32.9 60.2L35.1 61.5L37.3 63.0L39.5 64.7L41.7 66.5L43.9 68.5L46.1 70.6L48.3 72.9L50.5 75.1L52.7 74.7L54.9 73.6L57.1 72.5L59.3 71.3L61.5 69.9L63.7 68.3L65.9 66.6L68.1 64.7L70.3 62.6L72.4 60.5L74.6 58.2L76.8 56.7L79.0 57.8L81.2 58.8L83.4 60.0L85.6 61.3L87.8 62.8L90.0 64.4L92.2 66.2L94.4 68.2L96.6 70.3L98.8 72.5L101.0 74.7L103.2 74.8L105.4 73.8L107.6 72.7L109.8 71.5L112.0 70.1L114.2 68.6L116.4 66.9L118.5 65.0L120.7 63.0L122.9 60.8L125.1 58.6L127.3 56.6L129.5 57.6L131.7 58.6\" fill=\"none\" stroke=\"#f0b400\" stroke-width=\"11\" stroke-linecap=\"round\"/></g></svg>";
const Core = (function () { const module = { exports: {} };
'use strict';
// 计划书的文本模型：不依赖界面，浏览器和命令行共用，中文和英文都能读写。
// 文档按行保存，编辑只改行，导出就是把行接回去，所以导出再导入内容不变。

// 第几部分是什么（和模板里的编号一致）
const SEC = { what: '1', flows: '2', pages: '3', features: '4', data: '5', look: '6', rules: '7' };
const LAST_FILLED = 7;

// 计划书格式里的固定词（标签、状态、提示词模板）都在 locales/<语言>.json 的 doc 部分，代码里不写任何一种语言的原文。
// 浏览器里由构建注入 LOCALES；命令行和本机服务里直接读文件。
const LOC = typeof LOCALES !== 'undefined' ? LOCALES : { zh: require('../locales/zh.json'), en: require('../locales/en.json') };
const DOC_LANGS = Object.keys(LOC).filter((k) => LOC[k].doc);
const DOCS = DOC_LANGS.map((k) => LOC[k].doc);

const reEsc = (w) => String(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// 各语言里同一个意思的词：返回正则可用的「或」片段
const alt = (pick) => '(?:' + DOCS.reduce((all, d) => all.concat(pick(d)), []).map(reEsc).join('|') + ')';

// 兼容的写法：也认命令行和程序内部用的英文代号
const WORDS = {};
DOC_LANGS.forEach((k) => {
  const d = LOC[k].doc;
  WORDS[k] = {
    title: d.title, status: d.status, updated: d.updated, tbd: d.tbd, missing: d.missing, sep: d.sep,
    states: d.states, progress: d.progress,
    page: { fields: d.pageFields },
    feature: { fields: d.featureFields, progressLabel: d.progressLabel },
    newFlow: d.newFlow,
  };
});

const SEPS = '[：:]';
const TBD_RE = new RegExp(alt((d) => [d.tbd]) + SEPS, 'g');
const TBD_QUOTED_RE = new RegExp('[「"“]' + alt((d) => [d.tbd]) + '[^」"”]*[」"”]', 'g');
const TBD_LABEL_RE = new RegExp('^' + alt((d) => [d.tbd]) + '$', 'i');
const TBD_START_RE = new RegExp('^' + alt((d) => [d.tbd]));
const TBD_ALT = alt((d) => [d.tbd]).slice(3, -1);
const PLACEHOLDER_RE = /〈[^〉]*〉/g;
const INSTRUCTION_LINE_RE = /^〈[^〉]*〉$/;

const PARTS_RE = new RegExp('^' + alt((d) => d.labels.parts) + '$', 'i');
const CASES_RE = new RegExp('^' + alt((d) => d.labels.cases) + '$', 'i');
const WHAT_RE = new RegExp('^' + alt((d) => d.labels.what) + '$', 'i');
const PROGRESS_LABEL_RE = new RegExp('^' + alt((d) => d.labels.progress) + '$', 'i');
const ISSUES_RE = new RegExp('^' + alt((d) => d.labels.issues) + '$', 'i');
const STATE_WORDS = ['draft', 'doing', 'approved'].map((code) => [new RegExp('^' + alt((d) => [d.states[code]]) + '$', 'i'), code]);
const STATUS_WORD_RE = new RegExp('^' + alt((d) => [d.status]) + SEPS);
const APPROVED_NOTE_RE = new RegExp('^' + alt((d) => [d.states.approved]) + '\\s*(?:=|is)', 'i');
const ORIGINAL_RE = new RegExp('^' + alt((d) => [d.originalDescription]));

// 默认的计划书文件名：plan.md、计划书.md；同一个文件夹里的多份是 前缀+名称.md
const PLAN_NAMES = DOCS.map((d) => d.planFile);
const FILE_PREFIXES = DOCS.map((d) => d.filePrefix);
// 功能清单的文件名：features.md、功能清单.md，以及和计划书一一对应的 features-名称.md、功能清单-名称.md
const FEATURE_FILE_RE = new RegExp('^(?:' + DOCS.map((d) => reEsc(d.featureFile.replace(/\.md$/, ''))).join('|') + ')(?:-[^\\\\/:*?"<>|]{1,60})?\\.md$', 'i');
// 文件名：plan.md、计划书.md，或同一个文件夹里的 plan-名称.md、计划书-名称.md
const PLAN_FILE_RE = new RegExp('^(?:' + DOCS.map((d) => reEsc(d.planFile.replace(/\.md$/, ''))).join('|') + ')(?:-[^\\\\/:*?"<>|]{1,60})?\\.md$', 'i');

function split(md) {
  return String(md || '').replace(/\r\n?/g, '\n').split('\n');
}

function join(lines) {
  return lines.join('\n');
}

function info(text) {
  let m;
  if (/^\s*$/.test(text)) return { kind: 'blank' };
  if ((m = /^(#{1,6})\s+(.*)$/.exec(text))) return { kind: 'h', level: m[1].length, body: m[2].trim() };
  if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(text)) return { kind: 'hr' };
  if ((m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(text))) {
    return { kind: 'li', indent: m[1].replace(/\t/g, '    ').length, marker: m[2], ordered: /\d/.test(m[2]), body: m[3] };
  }
  return { kind: 'p', indent: /^(\s*)/.exec(text)[1].length, body: text.trim() };
}

// 「名字：内容」的拆分；名字里不含句号、逗号、分号，且不超过 40 个字符
function splitLabel(body) {
  const m = /^([^：:。，；]{1,40}?)(?:：|:\s|:$)\s*(.*)$/.exec(body);
  if (!m) return null;
  const label = m[1].trim();
  if (TBD_LABEL_RE.test(label)) return null;
  return { label, value: m[2] };
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function today(d) {
  const t = d || new Date();
  return t.getFullYear() + '-' + pad2(t.getMonth() + 1) + '-' + pad2(t.getDate());
}

function timeStamp(d) {
  const t = d || new Date();
  return t.getFullYear() + pad2(t.getMonth() + 1) + pad2(t.getDate()) + '-' + pad2(t.getHours()) + pad2(t.getMinutes()) + pad2(t.getSeconds());
}

// 文档用的是哪种语言：看状态行和标题，再看有没有汉字
function docLang(md) {
  const head = split(md).slice(0, 12).join('\n');
  for (const k of DOC_LANGS) {
    const d = LOC[k].doc;
    const re = new RegExp('^' + reEsc(d.status) + SEPS + '|^#\\s+(?:' + [d.title].concat(d.titleAlt || []).map(reEsc).join('|') + ')' + SEPS, 'm');
    if (re.test(head)) return k;
  }
  return /[\u4e00-\u9fff]/.test(md) ? 'zh' : 'en';
}

function footerStart(lines) {
  for (let i = lines.length - 1; i >= 0; i--) if (info(lines[i]).kind === 'hr') return i;
  return lines.length;
}

// 一个标题或列表项的子树结束位置（不含）
function rangeEnd(lines, i) {
  const me = info(lines[i]);
  const n = lines.length;
  let j = i + 1;
  if (me.kind === 'h') {
    while (j < n) {
      const t = info(lines[j]);
      if (t.kind === 'hr') break;
      if (t.kind === 'h' && t.level <= me.level) break;
      j++;
    }
  } else if (me.kind === 'li') {
    while (j < n) {
      const t = info(lines[j]);
      if (t.kind === 'blank') {
        let k = j + 1;
        while (k < n && info(lines[k]).kind === 'blank') k++;
        const nx = k < n ? info(lines[k]) : null;
        if (nx && nx.kind === 'li' && nx.indent > me.indent) { j = k; continue; }
        break;
      }
      if (t.kind === 'li' && t.indent > me.indent) { j++; continue; }
      if (t.kind === 'p' && t.indent > me.indent) { j++; continue; }
      break;
    }
  }
  while (j > i + 1 && info(lines[j - 1]).kind === 'blank') j--;
  return j;
}

// 标题自己的正文范围：到下一个标题或分隔线为止（不含子标题的内容）
function bodyRange(lines, i) {
  let j = i + 1;
  while (j < lines.length) {
    const t = info(lines[j]);
    if (t.kind === 'h' || t.kind === 'hr') break;
    j++;
  }
  return { start: i + 1, end: j };
}

function bodyText(lines, i) {
  const r = bodyRange(lines, i);
  return lines.slice(r.start, r.end).join('\n').replace(/^\n+|\n+$/g, '');
}

function setBody(md, headingLine, text) {
  const lines = split(md);
  const r = bodyRange(lines, headingLine);
  const t = String(text || '').replace(/\r\n?/g, '\n').replace(/^\n+|\n+$/g, '');
  const add = t ? [''].concat(t.split('\n'), ['']) : [''];
  return join(lines.slice(0, r.start).concat(add, lines.slice(r.end))).replace(/\n{3,}/g, '\n\n');
}

function deleteSubtree(lines, i) {
  const e = rangeEnd(lines, i);
  const out = lines.slice(0, i).concat(lines.slice(e));
  if (i > 0 && i < out.length && info(out[i - 1]).kind === 'blank' && info(out[i]).kind === 'blank') out.splice(i, 1);
  return out;
}

function sectionNo(lines, i) {
  for (let j = i; j >= 0; j--) {
    const t = info(lines[j]);
    if (t.kind === 'h' && t.level === 2) {
      const m = /^(\d+)\b/.exec(t.body);
      return m ? m[1] : '';
    }
  }
  return '';
}

function headings(lines) {
  const out = [];
  const end = footerStart(lines);
  lines.forEach((text, i) => {
    if (i >= end) return;
    const t = info(text);
    if (t.kind === 'h') out.push({ line: i, level: t.level, body: t.body });
  });
  return out;
}

function nextNonBlank(lines, i) {
  let j = i + 1;
  while (j < lines.length && info(lines[j]).kind === 'blank') j++;
  return j < lines.length ? j : -1;
}

// 「名字：」后面没有内容，也没有跟着列表
function isEmptyField(lines, i) {
  const t = info(lines[i]);
  if (t.kind !== 'p' && t.kind !== 'li') return false;
  const lv = splitLabel(t.body);
  if (!lv || lv.value.trim() !== '') return false;
  if (ISSUES_RE.test(lv.label)) return false;
  if (t.kind === 'li') return rangeEnd(lines, i) === i + 1;
  const nx = nextNonBlank(lines, i);
  return !(nx >= 0 && info(lines[nx]).kind === 'li');
}

// ---------- 待补 ----------

function pendingCount(text) {
  const t = text.replace(TBD_QUOTED_RE, '');
  const a = t.match(TBD_RE);
  const b = t.match(PLACEHOLDER_RE);
  return (a ? a.length : 0) + (b ? b.length : 0);
}

function pendingList(md) {
  const lines = split(md);
  const end = footerStart(lines);
  const out = [];
  lines.forEach((text, i) => {
    if (i >= end) return;
    const t = info(text);
    if (t.kind === 'blank' || t.kind === 'hr') return;
    if (APPROVED_NOTE_RE.test(text.trim())) return;
    let n = pendingCount(text);
    if (isEmptyField(lines, i)) n += 1;
    if (t.kind === 'h' && t.level === 2) {
      const m = /^(\d+)\b/.exec(t.body);
      if (m && Number(m[1]) >= 1 && Number(m[1]) <= LAST_FILLED) {
        const r = bodyRange(lines, i);
        const hasBody = lines.slice(r.start, r.end).some((l) => info(l).kind !== 'blank');
        const nx = nextNonBlank(lines, i);
        const hasChild = nx >= 0 && info(lines[nx]).kind === 'h' && info(lines[nx]).level >= 3;
        if (!hasBody && !hasChild) n += 1;
      }
    }
    if (n > 0) out.push({ line: i, count: n, text: text.trim(), section: sectionNo(lines, i) });
  });
  return out;
}

function countPending(md) {
  return pendingList(md).reduce((s, x) => s + x.count, 0);
}

// ---------- 状态 ----------

const STATUS_LINE_RE = new RegExp('^(' + alt((d) => [d.status]) + ')(' + SEPS + '\\s*)(.*?)((?:　+|\\s{2,})' + alt((d) => [d.updated]) + SEPS + '.*)?$');
const UPDATED_TAIL_RE = new RegExp('(' + alt((d) => [d.updated]) + SEPS + '\\s*).*$');

function stateCode(word) {
  const w = String(word || '').trim();
  for (const [re, code] of STATE_WORDS) if (re.test(w)) return code;
  return '';
}

// 返回 draft / doing / approved，找不到返回空字符串
function getStatus(md) {
  const lines = split(md).slice(0, 14);
  for (const l of lines) {
    const m = STATUS_LINE_RE.exec(l);
    if (m) return stateCode(m[3]);
  }
  return '';
}

function statusLabel(code, lang) {
  return (WORDS[lang] || WORDS.zh).states[code] || '';
}

function setStatus(md, code, date) {
  const lines = split(md);
  const lang = docLang(md);
  for (let i = 0; i < Math.min(lines.length, 14); i++) {
    const m = STATUS_LINE_RE.exec(lines[i]);
    if (m) {
      let tail = m[4] || '';
      if (tail) tail = tail.replace(UPDATED_TAIL_RE, '$1' + (date || today()));
      lines[i] = m[1] + m[2] + statusLabel(code, lang) + tail;
      return join(lines);
    }
  }
  return md;
}

function markPassed(md, date) {
  const n = countPending(md);
  if (n > 0) return { ok: false, pending: n, md };
  return { ok: true, pending: 0, md: setStatus(md, 'approved', date) };
}

// ---------- 名称与位置 ----------

const TITLE_RE = new RegExp('^#\\s+(?:' + alt((d) => [d.title].concat(d.titleAlt || [])) + SEPS + '\\s*)?(.*)$');

function titleName(md) {
  const t = split(md).find((l) => /^#\s+/.test(l));
  if (!t) return '';
  const m = TITLE_RE.exec(t);
  const v = (m ? m[1] : '').trim();
  return /〈[^〉]*〉/.test(v) ? '' : v;
}

function setTitle(md, name) {
  const lines = split(md);
  const lang = docLang(md);
  const i = lines.findIndex((l) => /^#\s+/.test(l));
  const v = String(name || '').trim() || LOC[lang].doc.projectName;
  const sep = WORDS[lang].sep;
  if (i < 0) return '# ' + WORDS[lang].title + sep + v + '\n\n' + md;
  // 功能清单的标题词保留
  lines[i] = '# ' + (isFeatureList(md) ? LOC[lang].doc.featureList : WORDS[lang].title) + sep + v;
  return join(lines);
}

// 标题行用的是「功能清单」这个词，就是功能清单文档
function isFeatureList(md) {
  const t = split(md).find((l) => /^#\s+/.test(l)) || '';
  return new RegExp('^#\\s+' + alt((d) => [d.featureList]) + SEPS).test(t);
}

function numberedName(body) {
  const m = /^(\d+\.\d+)\s+(.*)$/.exec(body);
  return m ? { no: m[1], name: m[2].trim() } : { no: '', name: body.trim() };
}

function findBlock(lines, i) {
  for (let j = i; j >= 0; j--) {
    const t = info(lines[j]);
    if (t.kind === 'h' && t.level === 3) return j;
    if (t.kind === 'h' && t.level <= 2) return -1;
  }
  return -1;
}

// 某一行「页面里有什么：」「怎么才算做好：」下面的列表项
function itemsUnder(lines, i) {
  const t = info(lines[i]);
  const out = [];
  if (t.kind === 'li') {
    const e = rangeEnd(lines, i);
    let childIndent = -1;
    for (let j = i + 1; j < e; j++) {
      const c = info(lines[j]);
      if (c.kind !== 'li') continue;
      if (childIndent < 0) childIndent = c.indent;
      if (c.indent === childIndent) out.push(j);
    }
    return out;
  }
  let j = i + 1;
  while (j < lines.length) {
    const c = info(lines[j]);
    if (c.kind === 'li') { out.push(j); j++; continue; }
    if (c.kind === 'blank') {
      const nx = nextNonBlank(lines, j - 1);
      if (nx >= 0 && info(lines[nx]).kind === 'li' && out.length) { j = nx; continue; }
    }
    break;
  }
  return out;
}

function itemName(body) {
  const lv = splitLabel(body);
  return (lv ? lv.label : body).trim();
}

function structure(md) {
  const lines = split(md);
  const end = footerStart(lines);
  const pages = [];
  const features = [];
  const widgets = [];
  const cases = [];
  lines.forEach((text, i) => {
    if (i >= end) return;
    const t = info(text);
    const sec = sectionNo(lines, i);
    if (t.kind === 'h' && t.level === 3) {
      const nn = numberedName(t.body);
      if (sec === SEC.pages) pages.push({ line: i, no: nn.no, name: nn.name });
      if (sec === SEC.features) features.push({ line: i, no: nn.no, name: nn.name });
      return;
    }
    if (t.kind !== 'p' && t.kind !== 'li') return;
    const lv = splitLabel(t.body);
    if (!lv) return;
    if (sec === SEC.pages && PARTS_RE.test(lv.label)) {
      itemsUnder(lines, i).forEach((j) => widgets.push({ line: j, name: itemName(info(lines[j]).body), block: findBlock(lines, j) }));
    }
    if (sec === SEC.features && CASES_RE.test(lv.label)) {
      itemsUnder(lines, i).forEach((j) => cases.push({ line: j, name: itemName(info(lines[j]).body), block: findBlock(lines, j) }));
    }
  });
  return { pages, features, widgets, cases };
}

// ---------- 三方合并 ----------

// a 和 b 里按顺序一致的行：返回 [[在 a 里的位置, 在 b 里的位置], ...]
function matchedLines(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = [];
  for (let i = 0; i <= n; i++) dp.push(new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  }
  const out = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push([i, j]); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return out;
}

// x 相对 base 改了哪几段：[{ a0, a1, x }]，base 的 [a0, a1) 被换成 x（a0 === a1 是插入）
function changedRegions(base, x) {
  const out = [];
  let ia = 0;
  let ix = 0;
  matchedLines(base, x).concat([[base.length, x.length]]).forEach((p) => {
    if (p[0] > ia || p[1] > ix) out.push({ a0: ia, a1: p[0], x: x.slice(ix, p[1]) });
    ia = p[0] + 1;
    ix = p[1] + 1;
  });
  return out;
}

// 三方合并：base 是上次同步的内容，mine 是页面里的，theirs 是文件夹里的。
// 两边改在不同位置的都保留；改在同一位置且内容不同的，取 prefer（'mine' 或 'theirs'）那一边。
function merge3(base, mine, theirs, prefer) {
  if (mine === theirs) return { text: mine, conflicts: 0 };
  if (mine === base) return { text: theirs, conflicts: 0 };
  if (theirs === base) return { text: mine, conflicts: 0 };
  const A = String(base).split('\n');
  const rm = changedRegions(A, String(mine).split('\n'));
  const rt = changedRegions(A, String(theirs).split('\n'));
  const out = [];
  let pos = 0;
  let pm = 0;
  let pt = 0;
  let conflicts = 0;
  const apply = (regs, s, e) => {
    const res = [];
    let at = s;
    regs.forEach((r) => { res.push.apply(res, A.slice(at, r.a0)); res.push.apply(res, r.x); at = r.a1; });
    res.push.apply(res, A.slice(at, e));
    return res;
  };
  while (pm < rm.length || pt < rt.length) {
    const first = !rt[pt] || (rm[pm] && rm[pm].a0 <= rt[pt].a0) ? rm[pm] : rt[pt];
    let s = first.a0;
    let e = first.a1;
    const gotM = [];
    const gotT = [];
    let grew = true;
    while (grew) {
      grew = false;
      while (pm < rm.length && rm[pm].a0 <= e) { gotM.push(rm[pm]); e = Math.max(e, rm[pm].a1); pm++; grew = true; }
      while (pt < rt.length && rt[pt].a0 <= e) { gotT.push(rt[pt]); e = Math.max(e, rt[pt].a1); pt++; grew = true; }
    }
    out.push.apply(out, A.slice(pos, s));
    let chosen;
    if (!gotT.length) chosen = apply(gotM, s, e);
    else if (!gotM.length) chosen = apply(gotT, s, e);
    else {
      const a = apply(gotM, s, e);
      const b = apply(gotT, s, e);
      if (a.join('\n') === b.join('\n')) chosen = a;
      else { conflicts++; chosen = prefer === 'theirs' ? b : a; }
    }
    out.push.apply(out, chosen);
    pos = e;
  }
  out.push.apply(out, A.slice(pos));
  return { text: out.join('\n'), conflicts };
}

// ---------- 进度 ----------

function progressCode(word) {
  const w = String(word || '').trim();
  // 各语言里写的进度词，也认程序内部的代号 todo / doing
  const code = ['todo', 'doing', 'done'].filter((c) => new RegExp('^(?:' + (c === 'done' ? '' : c + '|') + DOCS.map((d) => reEsc(d.progress[c])).join('|') + ')', 'i').test(w))[0];
  return code || '';
}

// 每个功能：名字、做什么、进度（todo / doing / done；没写按 todo）
function progressList(md) {
  const lines = split(md);
  return structure(md).features.map((f) => {
    const end = bodyRange(lines, f.line).end;
    let what = '';
    let code = '';
    for (let j = f.line + 1; j < end; j++) {
      const t = info(lines[j]);
      if (t.kind !== 'p' && t.kind !== 'li') continue;
      const lv = splitLabel(t.body);
      if (!lv) continue;
      if (WHAT_RE.test(lv.label) && !what) what = lv.value.replace(PLACEHOLDER_RE, '').trim();
      if (PROGRESS_LABEL_RE.test(lv.label)) code = progressCode(lv.value);
    }
    return { line: f.line, no: f.no, name: f.name, what, status: code || 'todo' };
  });
}

function setProgress(md, featureLine, code) {
  const lines = split(md);
  const lang = docLang(md);
  const w = WORDS[lang];
  const end = bodyRange(lines, featureLine).end;
  const text = w.progress.label + (lang === 'zh' ? '：' : ': ') + w.progress[code];
  for (let j = featureLine + 1; j < end; j++) {
    const t = info(lines[j]);
    if (t.kind !== 'p' && t.kind !== 'li') continue;
    const lv = splitLabel(t.body);
    if (lv && PROGRESS_LABEL_RE.test(lv.label)) {
      lines[j] = text;
      return join(lines);
    }
  }
  let at = end;
  while (at > featureLine + 1 && info(lines[at - 1]).kind === 'blank') at--;
  lines.splice(at, 0, text);
  return join(lines);
}

function nextProgress(code) {
  return code === 'todo' ? 'doing' : code === 'doing' ? 'done' : 'todo';
}

// ---------- 问题（功能清单里，每个功能下面做的过程中发现的问题）----------

const FIXED_RE = new RegExp('^' + alt((d) => [d.fixed]) + SEPS + '\\s*');
const DOING_RE = new RegExp('^' + alt((d) => [d.working]) + SEPS + '\\s*');

// 问题前面的状态词：done 是「已修：」，doing 是「处理中：」，todo 没有
function issuePrefix(md, state) {
  const d = LOC[docLang(md)].doc;
  return state === 'done' ? d.fixed + d.sep : state === 'doing' ? d.working + d.sep : '';
}

// 一条问题的状态：todo（没有前缀）、doing（处理中：）、done（已修：）
function issueState(body) {
  if (FIXED_RE.test(body)) return 'done';
  if (DOING_RE.test(body)) return 'doing';
  return 'todo';
}

function stripIssueState(body) {
  return body.replace(FIXED_RE, '').replace(DOING_RE, '');
}

// 每个功能的问题：[{ featureLine, items: [{ line, text, done }] }]
function issueList(md) {
  const lines = split(md);
  return structure(md).features.map((f) => {
    const end = bodyRange(lines, f.line).end;
    const items = [];
    for (let j = f.line + 1; j < end; j++) {
      const t = info(lines[j]);
      if (t.kind !== 'p' && t.kind !== 'li') continue;
      const lv = splitLabel(t.body);
      if (!lv || !ISSUES_RE.test(lv.label)) continue;
      itemsUnder(lines, j).forEach((k) => {
        const body = info(lines[k]).body;
        const state = issueState(body);
        items.push({ line: k, text: stripIssueState(body), state, done: state === 'done' });
      });
    }
    return { featureLine: f.line, no: f.no, name: f.name, items };
  });
}

// 在功能块里的「问题：」下面加一条；没有「问题：」就加在「进度：」前面
function addIssue(md, featureLine, text, date) {
  const lines = split(md);
  const lang = docLang(md);
  const label = LOC[lang].doc.issuesLabel;
  const end = bodyRange(lines, featureLine).end;
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return { ok: false, code: 'empty' };
  const bullet = '- ' + clean + '（' + (date || today()) + '）';
  let at = -1;
  let progressAt = -1;
  for (let j = featureLine + 1; j < end; j++) {
    const t = info(lines[j]);
    if (t.kind !== 'p' && t.kind !== 'li') continue;
    const lv = splitLabel(t.body);
    if (!lv) continue;
    if (ISSUES_RE.test(lv.label)) {
      const kids = itemsUnder(lines, j);
      at = (kids.length ? kids[kids.length - 1] : j) + 1;
      break;
    }
    if (PROGRESS_LABEL_RE.test(lv.label)) progressAt = j;
  }
  if (at >= 0) {
    lines.splice(at, 0, bullet);
  } else {
    const insertAt = progressAt >= 0 ? progressAt : end;
    lines.splice(insertAt, 0, label, bullet);
  }
  return { ok: true, md: join(lines) };
}

// 一次加多条：items 是 [{ featureLine, text }]，行号都按传入的 md 算。
// 从靠后的功能往前加，前面的行号不受影响；同一个功能里按传入的顺序加。空的跳过。
function addIssues(md, items, date) {
  const list = (items || []).filter((x) => String(x.text || '').trim());
  if (!list.length) return { ok: false, code: 'empty' };
  const groups = {};
  list.forEach((x) => { (groups[x.featureLine] = groups[x.featureLine] || []).push(x); });
  let out = md;
  Object.keys(groups).map(Number).sort((a, b) => b - a).forEach((line) => {
    groups[line].forEach((x) => {
      const r = addIssue(out, line, x.text, date);
      if (r.ok) out = r.md;
    });
  });
  return { ok: true, md: out, added: list.length };
}

// 设定一条问题的状态：todo / doing / done
function setIssueState(md, line, state) {
  const lines = split(md);
  const t = info(lines[line]);
  if (t.kind !== 'li') return md;
  const prefix = issuePrefix(md, state);
  lines[line] = ' '.repeat(t.indent) + t.marker + ' ' + prefix + stripIssueState(t.body);
  return join(lines);
}

function setIssueDone(md, line, done) {
  return setIssueState(md, line, done ? 'done' : 'todo');
}

function nextIssueState(state) {
  return state === 'todo' ? 'doing' : state === 'doing' ? 'done' : 'todo';
}

// ---------- 新增块 ----------

function nextNumber(md, section) {
  let max = 0;
  split(md).forEach((l) => {
    const t = info(l);
    if (t.kind !== 'h' || t.level !== 3) return;
    const m = /^(\d+)\.(\d+)\b/.exec(t.body);
    if (m && m[1] === String(section)) max = Math.max(max, Number(m[2]));
  });
  return max + 1;
}

// kind：page 或 feature。出错时返回 code：empty / duplicate
function checkName(md, kind, name, exceptLine) {
  const v = String(name || '').trim();
  if (!v) return { ok: false, code: 'empty', kind };
  const s = structure(md);
  const list = kind === 'page' ? s.pages : s.features;
  if (list.some((x) => x.name === v && x.line !== exceptLine)) return { ok: false, code: 'duplicate', kind };
  return { ok: true, name: v };
}

function endOfSection(lines, sec) {
  for (let i = 0; i < lines.length; i++) {
    const t = info(lines[i]);
    if (t.kind === 'h' && t.level === 2 && new RegExp('^' + sec + '\\b').test(t.body)) return rangeEnd(lines, i);
  }
  return -1;
}

function dropInstructions(lines, to) {
  return lines.filter((l, i) => !(i < to && INSTRUCTION_LINE_RE.test(l.trim())));
}

// 新增页面或功能：返回新块的标题行位置
function addBlock(md, kind, name) {
  const chk = checkName(md, kind, name);
  if (!chk.ok) return chk;
  const sec = kind === 'page' ? SEC.pages : SEC.features;
  let lines = split(md);
  const end0 = endOfSection(lines, sec);
  if (end0 < 0) return { ok: false, code: 'nosection', kind };
  lines = dropInstructions(lines, end0);
  const at = endOfSection(lines, sec);
  const w = WORDS[docLang(md)];
  const no = sec + '.' + nextNumber(md, sec);
  const body = kind === 'page' ? w.page.fields.slice() : w.feature.fields.concat([w.feature.progressLabel + w.progress.todo]);
  const add = ['', '### ' + no + ' ' + chk.name, ''].concat(body);
  return { ok: true, md: join(lines.slice(0, at).concat(add, lines.slice(at))), line: at + 1 };
}

function renameBlock(md, line, name) {
  const lines = split(md);
  const t = info(lines[line]);
  if (t.kind !== 'h') return { ok: false, code: 'noblock' };
  const kind = sectionNo(lines, line) === SEC.pages ? 'page' : 'feature';
  const chk = checkName(md, kind, name, line);
  if (!chk.ok) return chk;
  const nn = numberedName(t.body);
  lines[line] = '### ' + (nn.no ? nn.no + ' ' : '') + chk.name;
  return { ok: true, md: join(lines) };
}

// 用法一行一条，加在第 2 部分末尾
function addFlowLine(md) {
  let lines = split(md);
  const end0 = endOfSection(lines, SEC.flows);
  if (end0 < 0) return { ok: false, code: 'nosection' };
  lines = dropInstructions(lines, end0);
  const at = endOfSection(lines, SEC.flows);
  const add = [WORDS[docLang(md)].newFlow];
  if (at > 0 && info(lines[at - 1]).kind !== 'blank') add.unshift('');
  return { ok: true, md: join(lines.slice(0, at).concat(add, lines.slice(at))), line: at + add.length - 1 };
}

// ---------- 最初的描述：可以保留，也可以去掉 ----------

function originalRange(lines) {
  for (let i = 0; i < lines.length; i++) {
    const t = info(lines[i]);
    if (t.kind === 'h' && t.level === 2 && ORIGINAL_RE.test(t.body)) return { start: i, end: rangeEnd(lines, i) };
  }
  return null;
}

function hasOriginal(md) {
  return !!originalRange(split(md));
}

// keep 为 false 时去掉这一节并返回去掉的正文；为 true 且没有这一节时加在页脚之前，正文用 text，没有就写说明
function setOriginal(md, keep, text) {
  const lines = split(md);
  const at = originalRange(lines);
  if (!keep) {
    if (!at) return { md, text: '' };
    const body = join(lines.slice(at.start + 1, at.end)).trim();
    let from = at.start;
    while (from > 0 && info(lines[from - 1]).kind === 'blank') from--;
    return { md: join(lines.slice(0, from).concat(lines.slice(at.end))).replace(/\n{3,}/g, '\n\n'), text: body };
  }
  if (at) return { md, text: '' };
  const d = LOC[docLang(md)].doc;
  const end = footerStart(lines);
  const block = ['', '## ' + d.originalDescription, '', String(text || '').trim() || d.originalPlaceholder];
  const tail = end < lines.length ? [''] : [];
  return { md: join(lines.slice(0, end).concat(block, tail, lines.slice(end))).replace(/\n{3,}/g, '\n\n'), text: '' };
}

// ---------- 功能清单：和初始计划书是两份文件 ----------

// 计划书文件名对应的功能清单文件名：plan.md → features.md，计划书-名称.md → 功能清单-名称.md；不是计划书的名字返回空字符串
function featureFileFor(planFile) {
  const f = String(planFile || '');
  if (!PLAN_FILE_RE.test(f)) return '';
  for (const d of DOCS) {
    if (f.toLowerCase() === d.planFile.toLowerCase()) return d.featureFile;
    if (f.toLowerCase().indexOf(d.filePrefix.toLowerCase()) === 0) return d.featurePrefix + f.slice(d.filePrefix.length);
  }
  return '';
}

// 已经开始做：有功能的进度不是「未做」，或者功能下已经有问题
function workStarted(md) {
  return progressList(md).some((x) => x.status !== 'todo') || issueList(md).some((f) => f.items.length > 0);
}

// 第一次开始做的时候：把计划书里的功能（连同每个功能下已有的进度和问题）复制成独立的一份功能清单
function makeFeatureList(planMd) {
  const lang = docLang(planMd);
  const d = LOC[lang].doc;
  const lines = split(planMd);
  let from = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = info(lines[i]);
    if (t.kind === 'h' && t.level === 2 && new RegExp('^' + SEC.features + '\\b').test(t.body)) { from = i; break; }
  }
  const body = from < 0 ? [] : lines.slice(from, rangeEnd(lines, from));
  const name = titleName(planMd) || d.projectName;
  return join(['# ' + d.featureList + d.sep + name, ''].concat(body)).replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '') + '\n';
}

// ---------- 新建、导出 ----------

// template 是 plan.md 的内容；语言按模板自己的语言
function blankPlan(template, name, date) {
  const lang = docLang(template);
  const lines = split(template);
  const out = [];
  let skip = false;
  lines.forEach((l) => {
    if (skip) return;
    const t = info(l);
    if (t.kind === 'hr') { skip = true; return; }
    if (t.kind === 'h' && t.level === 2 && ORIGINAL_RE.test(t.body)) { skip = true; return; }
    if (t.kind === 'p' && INSTRUCTION_LINE_RE.test(t.body)) return;
    if (t.kind === 'li' && /^〈/.test(t.body)) return;
    out.push(l);
  });
  const w = WORDS[lang];
  const sep = w.sep;
  let md = join(out);
  md = md.replace(/^#\s+.*$/m, '# ' + w.title + sep + (name || LOC[lang].doc.projectName));
  md = md.replace(new RegExp('^' + alt((d) => [d.status]) + SEPS + '.*$', 'm'), w.status + sep + w.states.draft + '　　' + w.updated + sep + (date || today()));
  return md.replace(/\n{3,}/g, '\n\n').replace(/\s+$/, '') + '\n';
}

// 导出：没填的字段写成「待补：缺……」，不静默留空
function normalizeForExport(md) {
  const lines = split(md);
  const end = footerStart(lines);
  const lang = docLang(md);
  const w = WORDS[lang];
  const sep = w.sep;
  return join(lines.map((l, i) => {
    if (i >= end || !isEmptyField(lines, i)) return l;
    const lv = splitLabel(info(l).body);
    const base = l.replace(/\s+$/, '');
    return base + (lang === 'en' && /:$/.test(base) ? ' ' : '') + w.tbd + sep + w.missing + lv.label;
  }));
}

// ---------- 给 AI 的话 ----------

function buildAiPrompt(md, schema, note, lang) {
  const L = LOC[lang] ? lang : DOC_LANGS[0];
  const d = LOC[L].doc;
  const body = String(md || '').trim();
  const hasContent = body && split(body).some((l) => info(l).kind === 'p' && !INSTRUCTION_LINE_RE.test(l.trim()) && !STATUS_WORD_RE.test(l));
  const template = String(((schema && schema[L]) || {}).planTemplate || '').trim();
  return d.promptRules.concat([
    '',
    '```markdown',
    template,
    '```',
    '',
    hasContent ? d.currentPlan : d.myIdea,
    '',
    hasContent ? body : String(note || d.ideaPlaceholder).trim(),
    '',
    hasContent && note ? d.extraNotes + '\n\n' + String(note).trim() + '\n' : '',
  ]).join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

// 导入的文字认不出计划书格式时，包成一份计划书，原文放进「未识别」
function wrapUnrecognised(text, name, lang, date) {
  const L = LOC[lang] ? lang : DOC_LANGS[0];
  const d = LOC[L].doc;
  return [
    '# ' + d.title + d.sep + (name || d.projectName), '',
    d.status + d.sep + d.states.doing + '　　' + d.updated + d.sep + (date || today()), '',
    '## ' + d.unrecognised, '',
  ].concat(String(text).split('\n')).join('\n');
}

// ---------- 反馈 ----------

// 把选取的元素、截图、页面报错和一句话合成一段能直接贴给 AI 的话
// d: { text, page, view, element, styles, errors, shot }  shot 是附图的说明（文件名或「已复制」）
function buildFeedback(d, lang) {
  const F = LOC[LOC[lang] ? lang : DOC_LANGS[0]].doc.feedback;
  const out = [];
  if (d.page || d.view) out.push(F.page + [d.page, d.view].filter(Boolean).join('  '));
  if (d.element) out.push(F.element + d.element);
  if (d.styles) out.push(F.styles + d.styles);
  (d.summary || []).forEach((l) => out.push(l));
  if (d.shot) out.push(F.shot + d.shot);
  out.push('', String(d.text || '').trim() || F.placeholder);
  if (d.errors && d.errors.length) {
    out.push('', F.errors);
    d.errors.forEach((e) => out.push('- ' + e));
  }
  return out.join('\n') + '\n';
}

module.exports = {
  SEC, WORDS, PLAN_NAMES, FILE_PREFIXES, PLAN_FILE_RE, TBD_RE, TBD_LABEL_RE, TBD_ALT, TBD_START_RE, issuePrefix, wrapUnrecognised,
  split, join, info, splitLabel, today, timeStamp, docLang,
  rangeEnd, bodyRange, bodyText, setBody, deleteSubtree, sectionNo, headings,
  pendingList, countPending, getStatus, statusLabel, setStatus, markPassed,
  titleName, setTitle, structure, nextNumber, checkName,
  progressList, setProgress, nextProgress, issueList, addIssue, addIssues, setIssueDone, setIssueState, nextIssueState, merge3,
  addBlock, renameBlock, addFlowLine, blankPlan, normalizeForExport, hasOriginal, setOriginal,
  FEATURE_FILE_RE, featureFileFor, makeFeatureList, isFeatureList, workStarted,
  buildAiPrompt, buildFeedback,
};

return module.exports; })();
'use strict';
// 界面基础件：元素创建、语言、浏览器存储、文件夹读写、下载和复制。

const NS = 'shupian:' + (location.protocol === 'file:' ? location.pathname : location.origin);

function add(el, c) {
  if (c == null || c === false) return;
  if (Array.isArray(c)) { c.forEach((x) => add(el, x)); return; }
  el.append(c.nodeType ? c : document.createTextNode(String(c)));
}

function h(tag, props) {
  const el = document.createElement(tag);
  if (props) {
    Object.keys(props).forEach((k) => {
      const v = props[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style') el.setAttribute('style', v);
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'value' || k === 'disabled' || k === 'placeholder' || k === 'rows') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    });
  }
  for (let i = 2; i < arguments.length; i++) add(el, arguments[i]);
  return el;
}

function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

const LS = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v == null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  del(key) {
    try { localStorage.removeItem(key); } catch (e) { /* 存储不可用时没有可删的内容 */ }
  },
};

// ---------- 语言 ----------
// 界面文字都在 locales/<语言>.json 的 ui 部分，代码里只写键；LOCALES 由构建注入。
// 缺键时显示键名并报错，不回退成别的语言。

const LANG_LIST = Object.keys(LOCALES);

let LANG = (function () {
  // 地址里的 ?lang=zh|en 优先（被别的网页嵌入展示时指定界面语言），不写入存储
  const asked = new URLSearchParams(location.search).get('lang');
  if (LOCALES[asked]) return asked;
  const saved = LS.get('shupian:lang', '');
  if (LOCALES[saved]) return saved;
  const lang = String(navigator.language || '').toLowerCase();
  return LANG_LIST.filter((k) => lang.indexOf(k) === 0)[0] || 'en';
})();

// 指定语言的文字（比如要写进某份计划书的语言）
function tl(lang, key, params) {
  let s = LOCALES[lang].ui[key];
  if (s === undefined) {
    console.error('Missing text key: ' + key + ' (' + lang + ')');
    return '[' + key + ']';
  }
  if (params) Object.keys(params).forEach((k) => { s = s.split('{' + k + '}').join(String(params[k])); });
  return s;
}

function t(key, params) {
  return tl(LANG, key, params);
}

function setLang(l) {
  LANG = LOCALES[l] ? l : LANG;
  LS.set('shupian:lang', LANG);
}

// ---------- IndexedDB：文件夹授权句柄和图片 ----------

function openDb() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) { reject(new Error('indexedDB unavailable')); return; }
    const r = indexedDB.open('shupian', 1);
    r.onupgradeneeded = () => { r.result.createObjectStore('kv'); };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

function kv(mode, fn) {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction('kv', mode);
    const req = fn(tx.objectStore('kv'));
    tx.oncomplete = () => resolve(req ? req.result : undefined);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  }));
}
const kvGet = (k) => kv('readonly', (s) => s.get(k));
const kvSet = (k, v) => kv('readwrite', (s) => s.put(v, k));
const kvDel = (k) => kv('readwrite', (s) => s.delete(k));

// ---------- 本机服务（桌面快捷方式打开时） ----------
// 有服务时文件夹由服务读写，不需要浏览器的文件夹授权；页面带着启动时给的口令。

const SERVER = (function () {
  if (location.protocol !== 'http:' || location.hostname !== '127.0.0.1') return null;
  let k = new URLSearchParams(location.search).get('k') || '';
  try {
    if (k) sessionStorage.setItem('shupian:k', k);
    else k = sessionStorage.getItem('shupian:k') || '';
  } catch (e) { /* 没有会话存储时口令只在本次地址里 */ }
  return k ? { token: k } : null;
})();

const Api = {
  async call(method, path, body, raw) {
    const headers = { 'x-shupian-token': SERVER.token };
    let payload = body;
    if (body !== undefined && !(body instanceof Blob) && typeof body !== 'string') {
      headers['content-type'] = 'application/json';
      payload = JSON.stringify(body);
    }
    const r = await fetch(path, { method, headers, body: payload });
    if (!r.ok) throw new Error(path + ' ' + r.status);
    return raw ? r : r.json();
  },
};

// 书签方式：脚本是被书签从本机服务加载进来的，地址里带着服务的来源和口令（只用于本机网页）
const BOOKMARK = (function () {
  const el = document.currentScript;
  if (!el || !el.src) return null;
  try {
    const u = new URL(el.src);
    const k = u.searchParams.get('k') || '';
    if (u.protocol === 'http:' && u.hostname === '127.0.0.1' && /^[0-9a-f]{8,}$/.test(k) && /\/shupian\.js$/.test(u.pathname)) return { origin: u.origin, token: k };
  } catch (e) { /* 地址不是标准网址就不是书签加载的 */ }
  return null;
})();

// 悬浮窗到桌面服务的通道：在浏览器扩展里由扩展后台持有端口和口令；书签方式下直接请求脚本来源的服务
const Link = {
  available: !!BOOKMARK || (typeof chrome !== 'undefined' && !!(chrome.runtime && chrome.runtime.id && chrome.runtime.sendMessage)),
  // 失败时抛出的错误 message：unpaired（还没有打开过桌面小窗口）、down（服务没有响应）、或接口的状态码
  call(method, path, body) {
    if (BOOKMARK) {
      const headers = { 'x-shupian-token': BOOKMARK.token };
      let payload = body;
      if (body !== undefined && typeof body !== 'string') { headers['content-type'] = 'application/json'; payload = JSON.stringify(body); }
      return fetch(BOOKMARK.origin + path, { method, headers, body: payload }).then(
        (r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); },
        () => { throw new Error('down'); });
    }
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ shupian: 'api', method, path, body }, (r) => {
        if (chrome.runtime.lastError || !r) { reject(new Error('down')); return; }
        if (!r.ok) { reject(new Error(r.why)); return; }
        resolve(r.json);
      });
    });
  },
};

// ---------- 文件夹 ----------
// handle 要么是浏览器授权的目录句柄，要么是 { server: true, root, name }

const Folder = {
  supported() {
    return !!SERVER || typeof window.showDirectoryPicker === 'function';
  },
  async pick() {
    if (SERVER) {
      const r = await Api.call('POST', '/api/pick', {});
      if (!r.path) { const e = new Error('cancel'); e.name = 'AbortError'; throw e; }
      return { server: true, root: r.path, name: r.name };
    }
    return window.showDirectoryPicker({ mode: 'readwrite' });
  },
  async permission(handle, ask) {
    if (handle.server) return true;
    const opts = { mode: 'readwrite' };
    if ((await handle.queryPermission(opts)) === 'granted') return true;
    if (!ask) return false;
    return (await handle.requestPermission(opts)) === 'granted';
  },
  async dir(handle, sub, create) {
    let d = handle;
    for (const part of sub || []) d = await d.getDirectoryHandle(part, { create: !!create });
    return d;
  },
  // 文件不存在返回 null；存在返回 { text, mtime }（mtime 是文件的修改时间，毫秒）
  async readInfo(handle, sub, name) {
    if (handle.server) {
      const p = (sub || []).concat([name]).join('/');
      const r = await Api.call('GET', '/api/file?root=' + encodeURIComponent(handle.root) + '&p=' + encodeURIComponent(p));
      return r.exists ? { text: r.text, mtime: r.mtime || 0 } : null;
    }
    try {
      const d = await Folder.dir(handle, sub, false);
      const f = await (await d.getFileHandle(name)).getFile();
      return { text: await f.text(), mtime: f.lastModified || 0 };
    } catch (e) {
      if (e && e.name === 'NotFoundError') return null;
      throw e;
    }
  },
  async read(handle, sub, name) {
    const r = await Folder.readInfo(handle, sub, name);
    return r ? r.text : null;
  },
  async write(handle, sub, name, data) {
    if (handle.server) {
      const p = (sub || []).concat([name]).join('/');
      await Api.call('PUT', '/api/file?root=' + encodeURIComponent(handle.root) + '&p=' + encodeURIComponent(p), data);
      return;
    }
    const d = await Folder.dir(handle, sub, true);
    const fh = await d.getFileHandle(name, { create: true });
    const w = await fh.createWritable();
    await w.write(data);
    await w.close();
  },
  // 历史版本：项目文件夹里 .shupian/history/ 下，名字是 时间-功能清单文件名.md；最新的在前
  async historyList(handle, file) {
    if (handle.server) {
      const r = await Api.call('GET', '/api/history?root=' + encodeURIComponent(handle.root) + '&file=' + encodeURIComponent(file));
      return r.items;
    }
    let d;
    try {
      d = await Folder.dir(handle, ['.shupian', 'history'], false);
    } catch (e) {
      if (e && e.name === 'NotFoundError') return [];
      throw e;
    }
    const out = [];
    for await (const pair of d.entries()) {
      const name = pair[0];
      if (pair[1].kind === 'file' && /^\d{8}-\d{6}-/.test(name) && name.slice(16).toLowerCase() === file.toLowerCase()) out.push({ name });
    }
    return out.sort((a, b) => (a.name < b.name ? 1 : -1));
  },
  // 浏览器授权的文件夹没有服务替它清理：只留最近的 keep 份
  async historyPrune(handle, file, keep) {
    const all = await Folder.historyList(handle, file);
    const d = await Folder.dir(handle, ['.shupian', 'history'], false);
    for (const it of all.slice(keep)) await d.removeEntry(it.name);
  },
};

// 未提交的问题草稿：项目文件夹里 .shupian/drafts/<计划书文件名>.json；桌面窗口和页面上的悬浮窗读写同一份
const Draft = {
  sub: ['.shupian', 'drafts'],
  name: (file) => file + '.json',
  rel: (file) => '.shupian/drafts/' + file + '.json',
  parse(text) {
    const j = JSON.parse(text);
    return Array.isArray(j.rows) ? j.rows : [];
  },
  text: (rows) => JSON.stringify({ rows }),
};

// ---------- 下载和复制 ----------

// 所有下载走这里：文件名带保存时的日期时间，同一秒内再存加序号。
const nameCount = {};
function uniqueFileName(base, ext) {
  const stamp = Core.timeStamp();
  const key = base + '|' + stamp + '|' + ext;
  nameCount[key] = (nameCount[key] || 0) + 1;
  return base + '-' + stamp + (nameCount[key] > 1 ? '-' + nameCount[key] : '') + '.' + ext;
}

function saveAs(name, content, type) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: type || 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return name;
}

function download(content, base, ext, type) {
  return saveAs(uniqueFileName(base, ext), content, type);
}

function readText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsText(file);
  });
}

// 复制：先用剪贴板接口，不行再用选中复制；都不行返回 false，由调用方提示手动复制。
function copyText(text, fallbackEl) {
  const legacy = () => {
    try {
      const ta = fallbackEl || h('textarea', { value: text, style: 'position:fixed;left:0;top:0;opacity:0' });
      if (!fallbackEl) document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      if (!fallbackEl) ta.remove();
      return ok;
    } catch (e) {
      return false;
    }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true, () => legacy());
  }
  return Promise.resolve(legacy());
}

// 剪贴板只收 PNG：把任何图片转成 PNG
function toPng(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')); };
    img.src = url;
  });
}

async function copyImage(blob) {
  if (!navigator.clipboard || !window.ClipboardItem) return false;
  try {
    const png = await toPng(blob);
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
    return true;
  } catch (e) {
    return false;
  }
}

function errText(e) {
  return e && e.message ? e.message : String(e);
}

'use strict';
// 浮层：下拉菜单、弹窗、轻提示。每个应用外壳各建一份。

function createKit(appEl) {
  let popEl = null;
  let popAnchor = null;
  const modals = [];
  let toastEl = null;
  let toastTimer = 0;

  function closePop() {
    if (popEl) { popEl.remove(); popEl = null; popAnchor = null; }
  }

  function openPop(anchor, build) {
    if (popEl && popAnchor === anchor) { closePop(); return; }
    closePop();
    popEl = h('div', { class: 'pop' });
    popAnchor = anchor;
    build(popEl, closePop);
    appEl.append(popEl);
    const r = anchor.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = popEl.offsetWidth;
    const ph = popEl.offsetHeight;
    popEl.style.left = Math.max(8, Math.min(r.right - w, vw - w - 8)) + 'px';
    let top = r.bottom + 4;
    if (top + ph > vh - 8) top = Math.max(8, r.top - ph - 4);
    popEl.style.top = top + 'px';
  }

  function popItem(label, run, ex) {
    return h('button', { type: 'button', class: ex && ex.on ? 'on' : '', disabled: ex && ex.disabled, onclick() { closePop(); run(); } }, label);
  }

  function openModal(o) {
    closePop();
    const mask = h('div', { class: 'mask' });
    const m = { el: mask };
    const close = () => {
      const i = modals.indexOf(m);
      if (i >= 0) modals.splice(i, 1);
      mask.remove();
      if (o.onClose) o.onClose();
    };
    m.close = close;
    const box = h('div', { class: 'modal' + (o.small ? ' small' : ''), role: 'dialog', 'aria-label': o.title },
      h('div', { class: 'modal-body' }, o.body),
      o.foot ? h('div', { class: 'modal-foot' }, o.foot(close)) : null);
    mask.addEventListener('pointerdown', (e) => { m.down = e.target === mask; });
    mask.addEventListener('click', (e) => { if (e.target === mask && m.down) close(); });
    mask.append(box);
    appEl.append(mask);
    modals.push(m);
    return m;
  }

  function toast(msg, action) {
    if (toastEl) { toastEl.remove(); clearTimeout(toastTimer); }
    const el = h('div', { class: 'toast', role: 'status' }, h('span', { text: msg }));
    toastEl = el;
    const dismiss = () => { if (toastEl === el) { el.remove(); toastEl = null; clearTimeout(toastTimer); } };
    if (action) el.append(h('button', { type: 'button', class: 'btn sm', onclick(e) { e.stopPropagation(); dismiss(); action.run(); } }, action.label));
    el.addEventListener('click', dismiss);
    appEl.append(el);
    toastTimer = setTimeout(dismiss, action ? 9000 : 5000);
  }

  // Esc：先关弹窗，再关下拉；返回 true 表示已处理
  function escape() {
    if (modals.length) { modals[modals.length - 1].close(); return true; }
    if (popEl) { closePop(); return true; }
    return false;
  }

  document.addEventListener('pointerdown', (e) => {
    if (!popEl) return;
    const path = e.composedPath ? e.composedPath() : [];
    if (path.indexOf(popEl) >= 0 || (popAnchor && path.indexOf(popAnchor) >= 0)) return;
    closePop();
  }, true);

  return { closePop, openPop, popItem, openModal, toast, escape };
}

// 列表式写问题：点「添加一条」或回车加一条，每一条是一个输入框，随时可以改、可以补。
// 每一条可以 @ 多个功能（点「@ 选择功能」或输入 @），行里的 data 留给调用方放自己的东西（比如选取的多个元素）。
// o: { kit, features: () => [{ no, name }]（可以没有功能，那就没有 @）, placeholder（文字或函数）, onTarget(f),
//      rowTools(row, repaint)（每条上方的额外按钮）, rowExtra(row, repaint)（每条下方的额外内容）, onLayout(),
//      onChange()（用户改了内容；程序自己的 reset / restore / syncTargets 不触发） }
// 返回 { el, rows, items(), focusedRow(), syncTargets(f), reset(f), addRow(f), paint(), defaultF,
//        snapshot()（有内容的行，可存成 JSON）, restore(rows)（取回草稿，返回有没有取回） }
function createIssueList(o) {
  const el = h('div', { class: 'ilist' });
  const rows = [];
  const feats = () => (o.features ? o.features() : []);
  const label = (f) => (f.no ? f.no + ' ' : '') + f.name;
  const same = (a, b) => !!(a && b && a.no === b.no && a.name === b.name);
  const has = (row, f) => row.fs.some((x) => same(x, f));
  const api = { el, rows, defaultF: null };
  let focused = null;
  // 用户改动（输入、加减行、选功能、加元素）之后通知调用方保存草稿；程序自己重画不通知
  let quiet = false;
  const changed = () => { if (!quiet && o.onChange) o.onChange(); };

  // 勾选或取消勾选一个功能；下拉保持打开，可以连着选多个
  function choose(row, anchor, after) {
    const list = feats();
    if (!list.length) return;
    o.kit.openPop(anchor, (pop) => {
      const btns = list.map((f) => {
        const b = h('button', { type: 'button', class: has(row, f) ? 'on' : '', onclick() {
          if (has(row, f)) row.fs = row.fs.filter((x) => !same(x, f));
          else { row.fs.push(f); api.defaultF = f; if (o.onTarget) o.onTarget(f); }
          b.className = has(row, f) ? 'on' : '';
          paint();
          if (after) after();
        } }, label(f));
        return b;
      });
      btns.forEach((b) => pop.append(b));
    });
  }

  function makeRow(fs, text) {
    const row = { fs: (fs || []).slice(), text: text || '', data: {}, ta: null };
    const ta = h('textarea', { class: 'in', rows: 1, 'aria-label': t('issue_description'), value: row.text });
    row.ta = ta;
    ta.addEventListener('focus', () => { focused = row; });
    ta.addEventListener('input', () => {
      row.text = ta.value;
      autoGrow(ta);
      if (feats().length && /@$/.test(ta.value)) {
        ta.value = ta.value.slice(0, -1);
        row.text = ta.value;
        choose(row, ta);
      }
      changed();
    });
    ta.addEventListener('keydown', (e) => {
      if (e.isComposing) return;
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        add(api.defaultF ? [api.defaultF] : row.fs, rows.indexOf(row) + 1);
      } else if (e.key === 'Backspace' && ta.value === '' && rows.length > 1) {
        e.preventDefault();
        const i = rows.indexOf(row);
        rows.splice(i, 1);
        paint();
        const prev = rows[Math.max(0, i - 1)];
        prev.ta.focus({ preventScroll: true });
        prev.ta.setSelectionRange(prev.ta.value.length, prev.ta.value.length);
      }
    });
    return row;
  }

  function add(fs, at) {
    const row = makeRow(fs);
    rows.splice(at === undefined ? rows.length : at, 0, row);
    paint();
    row.ta.focus({ preventScroll: true });
    return row;
  }

  function paint() {
    clear(el);
    rows.forEach((row, i) => {
      const top = h('div', { class: 'irow-top' });
      if (feats().length) {
        row.fs.forEach((f) => top.append(h('span', { class: 'ftag' },
          h('button', { type: 'button', class: 'btn sm target', title: t('click_to_change_the_feature'), onclick(e) { choose(row, e.currentTarget); } }, '@ ' + label(f)),
          h('button', { type: 'button', class: 'x', title: t('remove_this_feature'), 'aria-label': t('remove_this_feature'), onclick() { row.fs = row.fs.filter((x) => !same(x, f)); paint(); } }, '✕'))));
        const more = h('button', { type: 'button', class: 'btn sm', title: t('choose_features'), onclick() { choose(row, more); } }, '@ ' + t('choose_features'));
        top.append(more);
      }
      if (o.rowTools) o.rowTools(row, paint).forEach((x) => { if (x) top.append(x); });
      top.append(h('span', { class: 'sp' }));
      if (rows.length > 1) {
        top.append(h('button', { type: 'button', class: 'x', title: t('delete'), 'aria-label': t('delete'), onclick() { rows.splice(i, 1); paint(); } }, '✕'));
      }
      const ph = typeof o.placeholder === 'function' ? o.placeholder() : o.placeholder;
      row.ta.setAttribute('placeholder', i === 0 && rows.length === 1 ? (ph || '') : '');
      const extra = o.rowExtra ? o.rowExtra(row, paint) : null;
      el.append(h('div', { class: 'irow' }, top, row.ta, extra));
    });
    el.append(h('button', { type: 'button', class: 'btn sm add-row', onclick() { add(api.defaultF ? [api.defaultF] : []); } }, t('add_an_issue')));
    setTimeout(() => growAll(el), 0);
    if (o.onLayout) o.onLayout();
    changed();
  }

  // 程序自己改列表时不当作用户改动
  const silently = (fn) => { quiet = true; try { fn(); } finally { quiet = false; } };

  api.items =() => rows.filter((r) => r.text.trim()).map((r) => ({ fs: r.fs.slice(), text: r.text.trim(), data: r.data }));
  api.focusedRow = () => (focused && rows.indexOf(focused) >= 0 ? focused : rows[rows.length - 1]);
  // 功能列表更新（比如换了计划书）：行里的功能按名字对回去，对不上的去掉；没有功能的行补上 f
  api.syncTargets = (f) => {
    const list = feats();
    api.defaultF = f || null;
    rows.forEach((r) => {
      r.fs = r.fs.map((x) => list.filter((y) => same(x, y))[0]).filter(Boolean);
      if (!r.fs.length && f) r.fs = [f];
    });
    silently(paint);
  };
  api.reset = (f) => {
    rows.length = 0;
    api.defaultF = f || null;
    rows.push(makeRow(f ? [f] : []));
    silently(paint);
  };
  // 草稿：只存有内容的行；功能按编号和名字存，取回时对回当前的功能列表，对不上的去掉
  api.snapshot = () => rows.filter((r) => r.text.trim()).map((r) => ({
    text: r.text,
    fs: r.fs.map((f) => ({ no: f.no, name: f.name })),
    data: r.data,
  }));
  api.restore = (saved) => {
    const list = feats();
    const keep = (Array.isArray(saved) ? saved : []).filter((x) => x && typeof x.text === 'string' && x.text.trim());
    if (!keep.length) return false;
    const defaults = api.defaultF ? [api.defaultF] : [];
    rows.length = 0;
    keep.forEach((x) => {
      const fs = (x.fs || []).map((f) => list.filter((y) => same(f, y))[0]).filter(Boolean);
      const row = makeRow(fs.length ? fs : defaults, x.text);
      row.data = x.data && typeof x.data === 'object' ? x.data : {};
      rows.push(row);
    });
    silently(paint);
    return true;
  };
  api.addRow = (f) => add(f ? [f] : []);
  api.paint = paint;
  api.reset(null);
  return api;
}

function autoGrow(ta) {
  ta.style.height = 'auto';
  ta.style.height = ta.scrollHeight + 2 + 'px';
}

function growAll(el) {
  Array.prototype.forEach.call(el.querySelectorAll('textarea.in'), autoGrow);
}

function copyThen(kit, text, ta) {
  copyText(text, ta).then((ok) => {
    if (ok) kit.toast(t('copied'));
    else {
      if (ta) ta.select();
      kit.toast(t('the_browser_does_not_allow_automatic_copying'));
    }
  });
}

// 弹出一个带全文的文本框，配复制按钮
function showText(kit, title, text, hint) {
  const ta = h('textarea', { class: 'in big', readonly: true, value: text, 'aria-label': t('full_text') });
  kit.openModal({
    title,
    body: h('div', null, hint ? h('p', { class: 'hint', text: hint }) : null, ta),
    foot: (close) => [
      h('button', { type: 'button', class: 'btn', onclick: close }, t('close')),
      h('button', { type: 'button', class: 'btn primary', onclick() { copyThen(kit, text, ta); } }, t('copy')),
    ],
  });
  setTimeout(() => { autoGrow(ta); ta.select(); }, 0);
}

'use strict';
// 悬浮窗用的页面工具：伪截图、选取元素、页面报错记录。只在叠在别的页面上时使用。

const pageErrors = [];
let errorHookOn = false;

function clock() {
  const t = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return p(t.getHours()) + ':' + p(t.getMinutes()) + ':' + p(t.getSeconds());
}

function pushError(text) {
  pageErrors.push(clock() + ' ' + String(text).replace(/\s+/g, ' ').slice(0, 300));
  if (pageErrors.length > 5) pageErrors.shift();
}

function installErrorHook() {
  if (errorHookOn) return;
  errorHookOn = true;
  window.addEventListener('error', (e) => {
    pushError((e.message || t('script_error')) + (e.filename ? ' (' + e.filename.split('/').pop() + ':' + e.lineno + ')' : ''));
  });
  window.addEventListener('unhandledrejection', (e) => {
    const r = e.reason;
    pushError(t('unhandled_promise_error') + (r && r.message ? r.message : r));
  });
  const orig = console.error;
  console.error = function () {
    try { pushError(Array.prototype.map.call(arguments, (a) => (a && a.message) || String(a)).join(' ')); } catch (e) { /* 记录失败不影响页面自己的输出 */ }
    return orig.apply(console, arguments);
  };
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

function withTimeout(p, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

// 伪截图：把当前可见区域的结构和样式画成一张图，不需要任何授权。
// 跨域样式、字体和图片取不到，对应部分显示为空白。
async function domShot() {
  const w = window.innerWidth;
  const hh = window.innerHeight;
  const body = document.body.cloneNode(true);
  const srcCanvas = document.body.querySelectorAll('canvas');
  const dstCanvas = body.querySelectorAll('canvas');
  Array.prototype.forEach.call(srcCanvas, (c, i) => {
    try {
      const im = document.createElement('img');
      im.src = c.toDataURL();
      const cs = getComputedStyle(c);
      im.setAttribute('style', 'width:' + cs.width + ';height:' + cs.height + ';display:' + cs.display);
      dstCanvas[i].parentNode.replaceChild(im, dstCanvas[i]);
    } catch (e) { /* 跨域画布取不到像素 */ }
  });
  const srcFields = document.body.querySelectorAll('input,textarea,select');
  const dstFields = body.querySelectorAll('input,textarea,select');
  Array.prototype.forEach.call(srcFields, (f, i) => {
    const d = dstFields[i];
    if (!d) return;
    if (f.tagName === 'TEXTAREA') d.textContent = f.value;
    else if (f.tagName === 'SELECT') Array.prototype.forEach.call(d.options, (o, k) => { if (k === f.selectedIndex) o.setAttribute('selected', ''); else o.removeAttribute('selected'); });
    else if (f.type === 'checkbox' || f.type === 'radio') { if (f.checked) d.setAttribute('checked', ''); else d.removeAttribute('checked'); }
    else d.setAttribute('value', f.value);
  });
  const imgs = Array.prototype.slice.call(body.querySelectorAll('img')).slice(0, 30);
  await Promise.all(imgs.map(async (im) => {
    try {
      const url = new URL(im.getAttribute('src') || '', location.href);
      if (url.protocol === 'data:' || url.origin !== location.origin) return;
      const r = await withTimeout(fetch(url.href), 3000);
      im.setAttribute('src', await blobToDataUrl(await r.blob()));
      im.removeAttribute('srcset');
    } catch (e) { /* 取不到的图保持原样，显示为空白 */ }
  }));
  Array.prototype.forEach.call(body.querySelectorAll('[data-shupian],script,noscript,iframe,video,audio,object,embed'), (n) => n.remove());
  let css = '';
  Array.prototype.forEach.call(document.styleSheets, (sheet) => {
    try { Array.prototype.forEach.call(sheet.cssRules, (r) => { css += r.cssText + '\n'; }); } catch (e) { /* 跨域样式表读不了 */ }
  });
  const bcs = getComputedStyle(document.body);
  const hcs = getComputedStyle(document.documentElement);
  const clear0 = 'rgba(0, 0, 0, 0)';
  const bg = bcs.backgroundColor !== clear0 ? bcs.backgroundColor : hcs.backgroundColor !== clear0 ? hcs.backgroundColor : '#ffffff';
  const xhtml = new XMLSerializer().serializeToString(body);
  const esc = css.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + hh + '"><foreignObject x="0" y="0" width="' + w + '" height="' + hh + '">'
    + '<div xmlns="http://www.w3.org/1999/xhtml" style="position:relative;width:' + w + 'px;height:' + hh + 'px;overflow:hidden;background:' + bg + '">'
    + '<style>' + esc + '</style>'
    + '<div style="position:absolute;left:' + -window.scrollX + 'px;top:' + -window.scrollY + 'px;width:' + document.documentElement.scrollWidth + 'px">' + xhtml + '</div>'
    + '</div></foreignObject></svg>';
  const img = new Image();
  await withTimeout(new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('render'));
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }), 8000);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = hh;
  canvas.getContext('2d').drawImage(img, 0, 0, w, hh);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85));
  if (!blob) throw new Error('encode');
  return { blob, kind: 'simulated' };
}

// 扩展里有浏览器自己的截图能力时优先用它
function realShot() {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) { resolve(null); return; }
    try {
      chrome.runtime.sendMessage({ shupian: 'capture' }, (res) => {
        if (chrome.runtime.lastError || !res || !res.dataUrl) { resolve(null); return; }
        fetch(res.dataUrl).then((r) => r.blob()).then((blob) => resolve({ blob, kind: 'real' }), () => resolve(null));
      });
    } catch (e) {
      resolve(null);
    }
  });
}

function elementPath(el) {
  const parts = [];
  let n = el;
  while (n && n.nodeType === 1 && n !== document.body && n !== document.documentElement && parts.length < 4) {
    let s = n.tagName.toLowerCase();
    if (n.id) { parts.unshift(s + '#' + n.id); break; }
    const cls = (n.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (cls.length) s += '.' + cls.join('.');
    parts.unshift(s);
    n = n.parentElement;
  }
  return parts.join(' > ');
}

function elementInfo(el) {
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const props = ['font-size', 'font-weight', 'color', 'background-color', 'padding', 'margin', 'border-radius', 'display'];
  const styles = props.map((p) => p + ' ' + cs.getPropertyValue(p)).concat(['width ' + Math.round(r.width) + 'px', 'height ' + Math.round(r.height) + 'px']).join('；');
  const text = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
  const label = (el.getAttribute('aria-label') || text || el.id || el.tagName.toLowerCase()).replace(/\s+/g, ' ').trim().slice(0, 20);
  return {
    path: elementPath(el) + (text ? t('element_text', { text }) : ''),
    sel: elementPath(el),
    label,
    styles,
  };
}

// 点选页面上的一个元素：移动高亮，点一下确认，Esc 取消
function pickElement(shadowRoot) {
  return new Promise((resolve) => {
    const box = document.createElement('div');
    box.setAttribute('style', 'position:fixed;z-index:2147483646;pointer-events:none;border:2px solid #e5322d;background:rgba(229,50,45,0.12);display:none');
    const tip = document.createElement('div');
    tip.setAttribute('style', 'position:fixed;z-index:2147483646;pointer-events:none;left:8px;top:8px;background:#000;color:#fff;font:13px/1.5 sans-serif;padding:4px 8px;border-radius:6px;max-width:calc(100vw - 16px);overflow-wrap:anywhere');
    tip.textContent = t('click_the_element_to_pick_press_esc_to');
    shadowRoot.append(box, tip);
    let cur = null;
    const done = (v) => {
      document.removeEventListener('mousemove', move, true);
      document.removeEventListener('click', click, true);
      document.removeEventListener('keydown', key, true);
      box.remove();
      tip.remove();
      resolve(v);
    };
    const move = (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el || el === document.documentElement || el === document.body) { box.style.display = 'none'; cur = null; return; }
      cur = el;
      const r = el.getBoundingClientRect();
      box.style.display = 'block';
      box.style.left = r.left + 'px';
      box.style.top = r.top + 'px';
      box.style.width = r.width + 'px';
      box.style.height = r.height + 'px';
      tip.textContent = elementPath(el);
    };
    const click = (e) => {
      e.preventDefault();
      e.stopPropagation();
      done(cur ? elementInfo(cur) : null);
    };
    const key = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(null); }
    };
    document.addEventListener('mousemove', move, true);
    document.addEventListener('click', click, true);
    document.addEventListener('keydown', key, true);
  });
}

// 当前页面的信息：标题、地址、窗口、滚动位置、能看到的标题和可点的东西
function pageInfo() {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight && cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const texts = (sel, max) => {
    const out = [];
    Array.prototype.forEach.call(document.querySelectorAll(sel), (el) => {
      if (out.length >= max || el.closest('[data-shupian]') || !visible(el)) return;
      const s = (el.innerText || el.value || el.getAttribute('aria-label') || el.placeholder || '').replace(/\s+/g, ' ').trim();
      if (s && out.indexOf(s) < 0) out.push(s.slice(0, 40));
    });
    return out;
  };
  return {
    title: document.title,
    scroll: Math.round(window.scrollX) + ',' + Math.round(window.scrollY),
    pixelRatio: window.devicePixelRatio,
    headings: texts('h1,h2,h3', 8),
    controls: texts('button,a[href],input,select,textarea,[role="button"]', 15),
  };
}

// 在页面上拖出一块区域，返回它在窗口里的位置；Esc 取消
function pickRegion(shadowRoot) {
  return new Promise((resolve) => {
    const layer = document.createElement('div');
    layer.setAttribute('style', 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483646;cursor:crosshair;background:rgba(0,0,0,0.25)');
    const box = document.createElement('div');
    box.setAttribute('style', 'position:fixed;border:2px solid #e5322d;background:rgba(255,255,255,0.15);display:none;pointer-events:none');
    const tip = document.createElement('div');
    tip.setAttribute('style', 'position:fixed;left:8px;top:8px;background:#000;color:#fff;font:13px/1.5 sans-serif;padding:4px 8px;border-radius:6px;pointer-events:none');
    tip.textContent = t('drag_to_select_the_area_press_esc_to_cancel');
    shadowRoot.append(layer, box, tip);
    let sx = 0;
    let sy = 0;
    let dragging = false;
    const done = (v) => {
      document.removeEventListener('keydown', key, true);
      layer.remove();
      box.remove();
      tip.remove();
      resolve(v);
    };
    const rectOf = (x, y) => ({ x: Math.min(sx, x), y: Math.min(sy, y), w: Math.abs(x - sx), h: Math.abs(y - sy) });
    layer.addEventListener('pointerdown', (e) => {
      dragging = true;
      sx = e.clientX;
      sy = e.clientY;
      box.style.display = 'block';
      layer.setPointerCapture(e.pointerId);
    });
    layer.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const r = rectOf(e.clientX, e.clientY);
      box.style.left = r.x + 'px';
      box.style.top = r.y + 'px';
      box.style.width = r.w + 'px';
      box.style.height = r.h + 'px';
    });
    layer.addEventListener('pointerup', (e) => {
      if (!dragging) return;
      dragging = false;
      const r = rectOf(e.clientX, e.clientY);
      done(r.w >= 8 && r.h >= 8 ? r : null);
    });
    const key = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(null); }
    };
    document.addEventListener('keydown', key, true);
  });
}

// 把整个可见区域的图按区域裁开
async function cropShot(shot, rect) {
  const url = URL.createObjectURL(shot.blob);
  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('decode'));
    img.src = url;
  });
  const kx = img.naturalWidth / window.innerWidth;
  const ky = img.naturalHeight / window.innerHeight;
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(rect.w * kx));
  c.height = Math.max(1, Math.round(rect.h * ky));
  c.getContext('2d').drawImage(img, rect.x * kx, rect.y * ky, rect.w * kx, rect.h * ky, 0, 0, c.width, c.height);
  URL.revokeObjectURL(url);
  const blob = await new Promise((resolve) => c.toBlob(resolve, 'image/webp', 0.85));
  if (!blob) throw new Error('encode');
  return { blob, kind: shot.kind };
}

'use strict';
// 本页部件和可调参数：个人用的悬浮窗没有连到计划书时，这个网页上「有什么、哪些能调」由网页自己带的一段声明，
// 加上自己在页面上圈选的部分组成。声明写在网页里：
//   window.SHUPIAN_ME = {
//     parts: [{ name: '开始按钮', selector: '#start' }],
//     tune: [{ key: 'bounce', label: '弹性', min: 0, max: 1, step: 0.05, value: 0.4, apply(v) { game.bounce = v; } }],
//     stages: [{ name: '第 3 关', values: { bounce: 0.6 } }],   // 一档进度：选中时 values 里的每个参数一起设成这些值
//   };
// 圈选的部件和调过的参数记在这个浏览器里，按页面地址分开；调过的参数下次打开页面时自动再用一遍。

function meDeclared() {
  return window.SHUPIAN_ME && typeof window.SHUPIAN_ME === 'object' ? window.SHUPIAN_ME : null;
}

// 声明了 SHUPIAN_ME 的网页可能会发布出去：悬浮窗只在本机（localhost、文件）、地址带 ?shupian=1、或这个浏览器里打开过开关时出现
function meAllowed() {
  if (!meDeclared()) return true;
  const host = location.hostname;
  if (location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '[::1]') return true;
  if (new URLSearchParams(location.search).get('shupian') === '1') { LS.set(NS + ':me-on', true); return true; }
  return LS.get(NS + ':me-on', false) === true;
}

const pageKey = () => location.origin + location.pathname;

const Parts = {
  // 声明的部件在前，圈选的在后；同名的以声明为准。no 留空，和计划书里的功能用同一种形状
  list() {
    const d = meDeclared();
    const declared = (d && Array.isArray(d.parts) ? d.parts : []).filter((p) => p && p.name)
      .map((p) => ({ no: '', name: String(p.name), sel: String(p.selector || ''), declared: true }));
    const mine = LS.get(NS + ':parts:' + pageKey(), []).filter((p) => p && p.name && !declared.some((x) => x.name === p.name))
      .map((p) => ({ no: '', name: String(p.name), sel: String(p.sel || ''), declared: false }));
    return declared.concat(mine);
  },
  add(name, sel) {
    const key = NS + ':parts:' + pageKey();
    const rest = LS.get(key, []).filter((p) => p && p.name !== name);
    rest.push({ name, sel });
    return LS.set(key, rest);
  },
  remove(name) {
    const key = NS + ':parts:' + pageKey();
    return LS.set(key, LS.get(key, []).filter((p) => p && p.name !== name));
  },
};

const Tune = {
  list() {
    const d = meDeclared();
    return (d && Array.isArray(d.tune) ? d.tune : []).filter((x) => x && x.key && typeof x.min === 'number' && typeof x.max === 'number');
  },
  saved() { return LS.get(NS + ':tune:' + pageKey(), {}); },
  value(item) {
    const v = Tune.saved()[item.key];
    return typeof v === 'number' ? v : item.value;
  },
  // 把值交给网页（apply 和 shupian:tune 事件），并记在这个浏览器里
  set(item, v) {
    const n = Math.min(item.max, Math.max(item.min, Number(v)));
    if (!isFinite(n)) return item.value;
    const all = Tune.saved();
    all[item.key] = n;
    LS.set(NS + ':tune:' + pageKey(), all);
    if (typeof item.apply === 'function') item.apply(n);
    window.dispatchEvent(new CustomEvent('shupian:tune', { detail: { key: item.key, value: n } }));
    return n;
  },
  // 页面打开时把调过的值再用一遍
  restore() {
    const all = Tune.saved();
    Tune.list().forEach((item) => {
      if (typeof all[item.key] === 'number' && typeof item.apply === 'function') item.apply(all[item.key]);
    });
  },
  // 调过的（和声明里的原值不同）：[{ label, value, was }]
  changed() {
    return Tune.list().filter((x) => Tune.value(x) !== x.value).map((x) => ({ label: x.label || x.key, value: Tune.value(x), was: x.value }));
  },
};

// 进度档位：一次设好一整组参数（比如「第 3 关」对应的金币、血量、速度），测试不同进度下的样子
const Stages = {
  list() {
    const d = meDeclared();
    return (d && Array.isArray(d.stages) ? d.stages : []).filter((s) => s && s.name && s.values && typeof s.values === 'object');
  },
  // 只设 tune 里有的参数
  apply(stage) {
    Tune.list().forEach((item) => { if (typeof stage.values[item.key] === 'number') Tune.set(item, stage.values[item.key]); });
  },
  // 当前所有参数正好等于哪一档（没有就是 null）
  current() {
    const tunes = Tune.list();
    return Stages.list().filter((s) => {
      const keys = tunes.filter((x) => typeof s.values[x.key] === 'number');
      return keys.length > 0 && keys.every((x) => Tune.value(x) === Math.min(x.max, Math.max(x.min, s.values[x.key])));
    })[0] || null;
  },
};

'use strict';
// 计划书页：项目情况、点一块直接修改、文件夹同步、导入导出。

const PLAN_NAMES = Core.PLAN_NAMES;
const ADD_LABEL = { 2: 'add_a_way_of_using_it', 3: 'add_a_page', 4: 'add_a_feature' };

function docLangOf(md) {
  return md && md.trim() ? Core.docLang(md) : LANG;
}

function sectionHint(md, sec) {
  const rows = ((SCHEMA[docLangOf(md)] || SCHEMA.zh).fields || {})[sec] || [];
  return rows.map((r) => r.name + '：' + r.purpose + (r.how ? '（' + LOCALES[docLangOf(md)].doc.example + r.how + '）' : '')).join('\n');
}

function newId() {
  return 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
}

function nameError(code, kind) {
  const what = kind === 'page' ? t('page') : t('feature');
  if (code === 'empty') return t('the_what_name_cannot_be_empty', { what });
  if (code === 'duplicate') return t('there_is_already_a_what_with_this_name', { what });
  return t('there_is_nowhere_to_add_it');
}

// 桌面窗口：打开时是贴在屏幕右下角的小窗口，之后切换标签、打开计划书都不改变大小和位置
const WINDOW_MODE = !!SERVER && new URLSearchParams(location.search).get('win') === '1';
const WINDOW_SIZE = { w: 360, h: 480 };

function placeWindow() {
  if (!WINDOW_MODE) return;
  window.resizeTo(WINDOW_SIZE.w, WINDOW_SIZE.h);
  window.moveTo((screen.availLeft || 0) + screen.availWidth - WINDOW_SIZE.w - 12, (screen.availTop || 0) + screen.availHeight - WINDOW_SIZE.h - 12);
}

function createApp(opts) {
  const root = opts.root;
  const index = LS.get(NS + ':index', null) || { current: '', list: [], open: [] };
  if (!index.open) index.open = [];
  // 同一个项目有两份文档：初始计划书，和确认开始做之后独立出来的功能清单。
  // S.md、S.past、S.future 指向正在看的那一份，下面的编辑、撤销都只作用在这一份上。
  const docs = {
    plan: { md: '', past: [], future: [] },
    features: { md: '', past: [], future: [], virtual: false },
  };
  const S = {
    doc: 'plan',
    picked: false,
    collapsed: {},
    view: 'plan',
    project: null,
    folder: { state: Folder.supported() ? 'none' : 'off', handle: null, name: '', path: '', synced: '', fsynced: '', file: PLAN_NAMES[0] },
    lastSync: '',
    editedAt: 0,
    issueSeen: {},
  };
  Object.defineProperties(S, {
    md: { get() { return docs[S.doc].md; }, set(v) { docs[S.doc].md = v; } },
    past: { get() { return docs[S.doc].past; }, set(v) { docs[S.doc].past = v; } },
    future: { get() { return docs[S.doc].future; }, set(v) { docs[S.doc].future = v; } },
  });
  let typingKey = '';
  let typingAt = 0;
  let folderTimer = 0;
  let pendIndex = -1;

  const app = h('div', { class: 'app' });
  const head = h('div', { class: 'head' });
  const body = h('div', { class: 'body' });
  const composerEl = h('div', { class: 'composer', style: 'display:none' });
  app.append(head, body, composerEl);
  // 提示条摆在输入区上面，不盖住输入区
  if (window.ResizeObserver) new ResizeObserver(() => app.style.setProperty('--composer-h', composerEl.offsetHeight + 'px')).observe(composerEl);
  const kit = createKit(app);
  const toast = kit.toast;

  // ---------- 项目与保存 ----------

  const projectKey = (id) => NS + ':p:' + id;

  function freshFolder() {
    return { state: Folder.supported() ? 'none' : 'off', handle: null, name: '', path: '', synced: '', fsynced: '', file: PLAN_NAMES[0] };
  }

  function resetDocs(plan, features) {
    docs.plan = { md: plan || '', past: [], future: [] };
    docs.features = { md: features || '', past: [], future: [], virtual: false };
    deriveFeatures();
    S.doc = docs.features.md.trim() ? 'features' : 'plan';
    S.picked = false;
  }

  // 计划书已确认并且已经开始做（有功能的进度不是「未做」，或者功能下已有问题），但还没有功能清单：
  // 先在页面里生成一份，第一次改动时才真的存成文件。确认之后还没开始做时仍然只是在更新计划书。
  function deriveFeatures() {
    const f = docs.features;
    if (f.md.trim() || Core.getStatus(docs.plan.md) !== 'approved' || !Core.workStarted(docs.plan.md)) return;
    f.md = Core.makeFeatureList(docs.plan.md);
    f.virtual = true;
  }

  // 计划书整份换了或刚确认：已经开始做的就生成功能清单，并先看它
  function settleDocs() {
    deriveFeatures();
    if (docs.features.md.trim()) S.doc = 'features';
  }

  // 开始做：从计划书生成功能清单，之后的进度、问题和新增的功能都记在功能清单里，计划书不再改
  function startWork() {
    if (docs.features.md.trim()) return;
    docs.features = { md: Core.makeFeatureList(docs.plan.md), past: [], future: [], virtual: false };
    S.doc = 'features';
    S.picked = true;
  }

  function loadProject(id) {
    const rec = LS.get(projectKey(id), null) || {};
    resetDocs(rec.md, rec.fmd);
    S.editedAt = rec.updated || 0;
    S.folder = freshFolder();
  }

  function saveIndex() {
    LS.set(NS + ':index', index);
  }

  function persist() {
    const f = docs.features;
    if (!LS.set(projectKey(S.project.id), { md: docs.plan.md, fmd: f.virtual ? '' : f.md, updated: S.editedAt || 0 })) toast(t('browser_storage_is_full_and_the_latest'));
    const nm = Core.titleName(docs.plan.md);
    if (nm && S.project.name !== nm) {
      S.project.name = nm;
      saveIndex();
    }
  }

  function startProject() {
    if (!index.list.length) {
      const id = newId();
      index.list.push({ id, name: opts.defaultName || t('new_project') });
      index.current = id;
      saveIndex();
    }
    let cur = index.list.filter((p) => p.id === index.current)[0];
    if (!cur) { cur = index.list[0]; index.current = cur.id; saveIndex(); }
    S.project = cur;
    if (index.open.indexOf(cur.id) < 0) index.open.push(cur.id);
    index.open = index.open.filter((id) => index.list.some((p) => p.id === id));
    saveIndex();
    loadProject(cur.id);
    folderInit();
    // 有桌面服务时，窗口一打开先看最近的文件夹
    if (SERVER && new URLSearchParams(location.search).get('view') === 'install') {
      S.view = 'install';
    } else if (SERVER && !opts.folder && (new URLSearchParams(location.search).get('view') === 'hub' || WINDOW_MODE)) {
      S.view = 'hub';
      // 还没写过内容、也没连文件夹的空项目不占标签
      if (!docs.plan.md.trim() && !S.project.path) {
        index.open = index.open.filter((id) => id !== S.project.id);
        saveIndex();
      }
    }
  }

  // 打开一个项目：加到标签里并切过去
  function useProject(p) {
    S.project = p;
    S.view = 'plan';
    index.current = p.id;
    if (index.open.indexOf(p.id) < 0) index.open.push(p.id);
    saveIndex();
    loadProject(p.id);
    folderInit();
    renderAll();
  }

  function switchProject(id) {
    persist();
    const p = index.list.filter((x) => x.id === id)[0];
    if (p) useProject(p);
  }

  function createProject(extra) {
    persist();
    const p = Object.assign({ id: newId(), name: t('new_project') }, extra || {});
    index.list.push(p);
    useProject(p);
  }

  function showHub() {
    persist();
    S.view = 'hub';
    renderAll();
  }

  // 关掉一个标签：项目还在，可以从「更多」里再打开
  function closeTab(id) {
    persist();
    const at = index.open.indexOf(id);
    if (at < 0) return;
    index.open.splice(at, 1);
    saveIndex();
    if (S.view === 'plan' && S.project.id === id) {
      const nextId = index.open[Math.min(at, index.open.length - 1)];
      const p = index.list.filter((x) => x.id === nextId)[0];
      if (p) useProject(p);
      else if (SERVER) showHub();
      else createProject();
    } else renderAll();
  }

  function deleteProject(id) {
    const p = index.list.filter((x) => x.id === id)[0];
    if (!p) return;
    const rec = LS.get(projectKey(id), null);
    const pos = index.list.indexOf(p);
    index.list.splice(pos, 1);
    index.open = index.open.filter((x) => x !== id);
    LS.del(projectKey(id));
    if (!index.list.length) index.list.push({ id: newId(), name: t('new_project') });
    if (index.current === id) useProject(index.list[0]);
    else { saveIndex(); renderAll(); }
    toast(t('deleted_project_name', { name: p.name }), {
      label: t('undo'),
      run() {
        index.list.splice(Math.min(pos, index.list.length), 0, p);
        if (rec) LS.set(projectKey(id), rec);
        saveIndex();
        useProject(p);
      },
    });
  }

  // ---------- 修改记录与撤销 ----------

  // 草稿一动手就变整理中；确认之后计划书是初版，后面的修改记在功能清单里，状态保持已通过
  function autoStatus(md) {
    return Core.getStatus(md) === 'draft' ? Core.setStatus(md, 'doing') : md;
  }

  function changed() {
    S.editedAt = Date.now();
    persist();
    clearTimeout(folderTimer);
    if (S.folder.state === 'ready') folderTimer = setTimeout(folderPush, 600);
  }

  function commit(md, raw) {
    const next = raw ? md : autoStatus(md);
    if (next === S.md) return;
    if (S.doc === 'features') docs.features.virtual = false;
    S.past.push(S.md);
    if (S.past.length > 100) S.past.shift();
    S.future = [];
    S.md = next;
    typingKey = '';
    changed();
  }

  function typing(md, key) {
    const next = autoStatus(md);
    const now = Date.now();
    if (typingKey !== key || now - typingAt > 1500) {
      S.past.push(S.md);
      if (S.past.length > 100) S.past.shift();
      S.future = [];
    }
    typingKey = key;
    typingAt = now;
    if (S.doc === 'features') docs.features.virtual = false;
    S.md = next;
    changed();
    renderStatus();
  }

  // 「最初的描述」去掉时正文记在这一次打开的页面里，再打开开关时放回去；去掉也可以撤销
  const droppedOriginal = {};
  function setOriginal(keep) {
    const r = Core.setOriginal(S.md, keep, droppedOriginal[S.project.id]);
    if (!keep) droppedOriginal[S.project.id] = r.text;
    commit(r.md, true);
    renderBody();
  }

  function undo() {
    if (!S.past.length) return false;
    S.future.push(S.md);
    S.md = S.past.pop();
    typingKey = '';
    changed();
    renderAll();
    return true;
  }

  function redo() {
    if (!S.future.length) return false;
    S.past.push(S.md);
    S.md = S.future.pop();
    typingKey = '';
    changed();
    renderAll();
    return true;
  }

  // ---------- 文件夹 ----------

  // 项目指定了哪一份（同一个文件夹里可以有多份）就只读那一份；没指定按默认的名字找
  async function findPlan(handle) {
    const names = S.project.file ? [S.project.file] : PLAN_NAMES;
    for (const name of names) {
      const got = await Folder.readInfo(handle, [], name);
      if (got) return { name, text: got.text, mtime: got.mtime };
    }
    return { name: names[0], text: null, mtime: 0 };
  }

  // 当前这个计划书文件对应的功能清单文件
  const featureFile = () => Core.featureFileFor(S.folder.file);

  async function findFeatures() {
    const name = featureFile();
    if (!name) return { name: '', text: null, mtime: 0 };
    const got = await Folder.readInfo(S.folder.handle, [], name);
    return { name, text: got ? got.text : null, mtime: got ? got.mtime : 0 };
  }

  async function folderInit() {
    if (!Folder.supported()) return;
    const pid = S.project.id;
    try {
      let handle = null;
      if (S.project.path && SERVER) handle = { server: true, root: S.project.path, name: S.project.name };
      else handle = await kvGet('handle:' + NS + ':' + pid);
      if (!handle || S.project.id !== pid) return;
      S.folder.handle = handle;
      S.folder.name = handle.name || S.project.name;
      S.folder.path = handle.server ? handle.root : '';
      S.folder.file = S.project.file || PLAN_NAMES[0];
      const ok = await Folder.permission(handle, false);
      S.folder.state = ok ? 'ready' : 'need';
      renderAll();
      if (ok) await folderPull(false, false);
    } catch (e) {
      S.folder.state = Folder.supported() ? 'none' : 'off';
    }
  }

  async function connectHandle(handle) {
    S.folder.handle = handle;
    S.folder.name = handle.name;
    S.folder.path = handle.server ? handle.root : '';
    S.folder.state = 'ready';
    S.folder.synced = '';
    S.folder.fsynced = '';
    renderAll();
    await folderPull(true, false);
  }

  async function folderConnect() {
    if (SERVER) { showHub(); return; }
    let handle;
    try {
      handle = await Folder.pick();
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      toast(t('could_not_open_the_folder_why', { why: errText(e) }));
      return;
    }
    try { await kvSet('handle:' + NS + ':' + S.project.id, handle); } catch (e) { toast(t('the_folder_permission_could_not_be_saved')); }
    await connectHandle(handle);
  }

  // 本机服务：把某个文件夹变成一个项目并连接
  async function connectFolderPath(path) {
    let r;
    try {
      r = await Api.call('POST', '/api/connect', { path });
    } catch (e) {
      toast(t('could_not_open_the_folder_why', { why: errText(e) }));
      return;
    }
    let p = index.list.filter((x) => x.path && x.path.toLowerCase() === r.path.toLowerCase())[0];
    persist();
    if (!p) {
      p = { id: newId(), name: r.summary && r.summary.title ? r.summary.title : r.name, path: r.path };
      index.list.push(p);
    }
    if (r.file) p.file = r.file;
    else delete p.file;
    useProject(p);
  }

  // 新建计划书：先不放进文件夹，写好以后用「保存到文件夹」存
  function newPlanHere() {
    persist();
    const p = { id: newId(), name: t('new_project') };
    index.list.push(p);
    useProject(p);
    newBlank();
  }

  function apiStatus(e) {
    return Number((/ (\d+)$/.exec(e && e.message) || [])[1] || 0);
  }

  // 先选放在哪里，再起名字，创建后交给 then(路径)
  async function newFolderFlow(then) {
    let where;
    try {
      where = await Api.call('POST', '/api/pick', { description: t('choose_where_to_put_the_new_folder') });
    } catch (e) {
      toast(t('could_not_open_the_folder_why', { why: errText(e) }));
      return;
    }
    if (!where.path) return;
    const input = h('input', { class: 'in', placeholder: t('folder_name'), 'aria-label': t('folder_name') });
    const err = h('p', { class: 'err', style: 'display:none' });
    let closeModal = null;
    const go = async () => {
      err.style.display = 'none';
      try {
        const r = await Api.call('POST', '/api/mkdir', { parent: where.path, name: input.value });
        closeModal();
        then(r.path);
      } catch (e) {
        const st = apiStatus(e);
        err.textContent = st === 409 ? t('a_folder_with_this_name_already_exists') : st === 400 ? t('the_name_cannot_be_empty_or_contain_any_of') : t('could_not_create_the_folder_why', { why: errText(e) });
        err.style.display = '';
        input.focus({ preventScroll: true });
      }
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    kit.openModal({
      title: t('new_folder'),
      small: true,
      body: h('div', null, h('p', { class: 'muted', text: where.path }), input, err),
      foot: (close) => {
        closeModal = close;
        return [
          h('button', { type: 'button', class: 'btn', onclick: close }, t('cancel')),
          h('button', { type: 'button', class: 'btn primary', onclick: go }, t('create')),
        ];
      },
    });
    setTimeout(() => input.focus({ preventScroll: true }), 0);
  }

  async function pickFolderPath() {
    try {
      const r = await Api.call('POST', '/api/pick', { description: t('choose_the_folder_that_holds_the_plan') });
      return r.path || '';
    } catch (e) {
      toast(t('could_not_open_the_folder_why', { why: errText(e) }));
      return '';
    }
  }

  // 把当前的计划书存进一个文件夹；文件夹里已有计划书时让用户选，不直接覆盖
  async function attachFolderPath(path) {
    let r;
    try {
      r = await Api.call('POST', '/api/connect', { path });
    } catch (e) {
      toast(t('could_not_open_the_folder_why', { why: errText(e) }));
      return;
    }
    // file：写到哪一份；不给就是文件夹当前的这一份（没有计划书时是默认名字）
    const attach = async (useFolderPlan, file) => {
      const target = file || r.file || PLAN_NAMES[0];
      S.project.path = r.path;
      S.project.file = target;
      saveIndex();
      S.folder = Object.assign(freshFolder(), { handle: { server: true, root: r.path, name: r.name }, name: r.name, path: r.path, file: target, state: 'ready' });
      if (file || useFolderPlan) {
        try { await Api.call('POST', '/api/current', { path: r.path, file: target }); } catch (e) { if (useFolderPlan) toast(t('could_not_select_the_plan_why', { why: errText(e) })); }
      }
      if (useFolderPlan) {
        const found = await findPlan(S.folder.handle);
        S.folder.file = found.name;
        S.folder.synced = found.text;
        commitTo('plan', found.text);
        S.folder.fsynced = '';
        docs.features = { md: '', past: [], future: [], virtual: false };
        deriveFeatures();
        await pullDoc('features', false, true);
        S.doc = docs.features.md.trim() ? 'features' : 'plan';
        S.lastSync = clockText();
        renderAll();
        toast(t('loaded_the_plan_from_the_folder'), { label: t('undo'), run: () => undo() });
      } else {
        await folderPush();
        S.lastSync = clockText();
        renderAll();
        toast(t('saved_to_the_folder_name', { name: r.name }));
      }
    };
    if (!r.summary) { attach(false); return; }
    kit.openModal({
      title: t('this_folder_already_has_a_plan'),
      small: true,
      body: h('p', { class: 'p', text: t('which_one_to_use_replace_with_current') }),
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('cancel')),
        h('button', { type: 'button', class: 'btn', onclick() { close(); attach(true); } }, t('use_the_one_in_the_folder')),
        h('button', { type: 'button', class: 'btn', onclick() { close(); askPlanName(r, (file) => attach(false, file)); } }, t('save_as_a_new_plan')),
        h('button', { type: 'button', class: 'btn primary', onclick() { close(); attach(false); } }, t('replace_with_current')),
      ],
    });
  }

  // 同一个文件夹里的多份计划书：文件名是 计划书-名称.md（英文界面是 plan-名称.md）
  function planFileName(name) {
    return LOCALES[LANG].doc.filePrefix + name.trim() + '.md';
  }

  // 问一个名称，得到文件名后交给 then(文件名)；info 是 /api/connect 的返回，用来判重
  function askPlanName(info, then) {
    const input = h('input', { class: 'in', placeholder: t('plan_name'), 'aria-label': t('plan_name') });
    const err = h('p', { class: 'err', style: 'display:none' });
    let closeModal = null;
    const go = () => {
      const name = input.value.trim();
      const file = planFileName(name);
      const bad = !name ? t('the_name_cannot_be_empty') : name.length > 60 || /[\\\\/:*?"<>|]/.test(name) ? t('the_name_cannot_be_longer_than_60_characters')
        : info.plans.some((x) => x.file.toLowerCase() === file.toLowerCase()) ? t('a_plan_with_this_name_already_exists_choose') : '';
      if (bad) { err.textContent = bad; err.style.display = ''; input.focus({ preventScroll: true }); return; }
      closeModal();
      then(file, name);
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    kit.openModal({
      title: t('new_plan_in_this_folder'),
      small: true,
      body: h('div', null, input, err),
      foot: (close) => {
        closeModal = close;
        return [
          h('button', { type: 'button', class: 'btn', onclick: close }, t('cancel')),
          h('button', { type: 'button', class: 'btn primary', onclick: go }, t('create')),
        ];
      },
    });
    setTimeout(() => input.focus({ preventScroll: true }), 0);
  }

  async function switchPlanFile(file) {
    persist();
    if (S.folder.state === 'ready') await folderPush();
    S.project.file = file;
    saveIndex();
    resetDocs('', '');
    S.folder.file = file;
    S.folder.synced = '';
    S.folder.fsynced = '';
    try {
      await Api.call('POST', '/api/current', { path: S.folder.path, file });
    } catch (e) {
      toast(t('could_not_select_the_plan_why', { why: errText(e) }));
    }
    renderAll();
    await folderPull(true, false);
  }

  async function openPlanMenu(anchor) {
    let r;
    try {
      r = await Api.call('POST', '/api/connect', { path: S.folder.path });
    } catch (e) {
      toast(t('could_not_open_the_folder_why', { why: errText(e) }));
      return;
    }
    kit.openPop(anchor, (pop) => {
      r.plans.forEach((pl) => pop.append(kit.popItem((pl.title || r.name) + '（' + pl.file + '）', () => { if (pl.file !== S.folder.file) switchPlanFile(pl.file); }, { on: pl.file === S.folder.file })));
      pop.append(h('hr'));
      pop.append(kit.popItem(t('new_plan_in_this_folder'), () => askPlanName(r, async (file, name) => {
        try {
          await Folder.write(S.folder.handle, [], file, Core.blankPlan(SCHEMA[LANG].planTemplate, name, Core.today()));
        } catch (e) {
          toast(t('could_not_save_to_the_folder_why', { why: errText(e) }));
          return;
        }
        switchPlanFile(file);
      })));
    });
  }

  function openSaveTo(anchor) {
    kit.openPop(anchor, (pop, close) => {
      pop.append(kit.popItem(t('choose_an_existing_folder'), async () => {
        const path = await pickFolderPath();
        if (path) attachFolderPath(path);
      }));
      pop.append(kit.popItem(t('new_folder'), () => newFolderFlow(attachFolderPath)));
    });
  }

  // 拖入文件夹：服务按名字和里面的文件找到它的地址；找不到就直接用浏览器授权的方式打开
  async function dropFolder(dt) {
    const item = dt.items && dt.items[0];
    if (!item || item.kind !== 'file') { toast(t('drop_a_folder_not_a_file')); return; }
    if (!item.getAsFileSystemHandle) { toast(t('this_browser_cannot_open_dropped_folders_use')); return; }
    let handle;
    const entries = [];
    try {
      handle = await item.getAsFileSystemHandle();
      if (handle && handle.kind === 'directory' && SERVER) {
        for await (const pair of handle.entries()) { entries.push(pair[0]); if (entries.length >= 200) break; }
      }
    } catch (e) {
      toast(t('could_not_read_the_dropped_item_why', { why: errText(e) }));
      return;
    }
    if (!handle || handle.kind !== 'directory') { toast(t('drop_a_folder_not_a_file')); return; }
    if (SERVER) {
      let found;
      try {
        found = await Api.call('POST', '/api/locate', { name: handle.name, entries });
      } catch (e) {
        toast(t('could_not_open_the_folder_why', { why: errText(e) }));
        return;
      }
      if (found.candidates.length === 1) { connectFolderPath(found.candidates[0]); return; }
      if (found.candidates.length > 1) {
        const dup = kit.openModal({
          title: t('several_folders_have_this_name_choose_one'),
          small: true,
          body: h('div', null, found.candidates.map((p) => h('button', { type: 'button', class: 'btn pick-row', onclick() { dup.close(); connectFolderPath(p); } }, p))),
          foot: (close) => [h('button', { type: 'button', class: 'btn', onclick: close }, t('cancel'))],
        });
        return;
      }
    }
    try {
      if (!(await Folder.permission(handle, true))) { toast(t('permission_was_not_granted_why', { why: t('no_read_and_write_permission') })); return; }
    } catch (e) {
      toast(t('permission_was_not_granted_why', { why: errText(e) }));
      return;
    }
    persist();
    const p = { id: newId(), name: handle.name };
    index.list.push(p);
    try { await kvSet('handle:' + NS + ':' + p.id, handle); } catch (e) { toast(t('the_folder_permission_could_not_be_saved')); }
    useProject(p);
    if (SERVER) toast(t('the_address_of_this_folder_was_not_found_you'));
  }

  async function folderRegrant() {
    if (!S.folder.handle) return;
    try {
      const ok = await Folder.permission(S.folder.handle, true);
      S.folder.state = ok ? 'ready' : 'need';
      renderAll();
      if (ok) await folderPull(true, false);
    } catch (e) {
      toast(t('permission_was_not_granted_why', { why: errText(e) }));
    }
  }

  async function folderDisconnect() {
    if (!SERVER) { try { await kvDel('handle:' + NS + ':' + S.project.id); } catch (e) { /* 句柄已不存在 */ } }
    delete S.project.path;
    saveIndex();
    S.folder = freshFolder();
    renderAll();
    toast(t('folder_disconnected'));
  }

  // 历史版本：功能清单被改写之前，把旧的一份存进文件夹里的 .shupian/history/；
  // 平时隔几分钟存一份，有功能被去掉时马上存，防止写过的功能找不回来
  const HISTORY_GAP = 5 * 60 * 1000;
  const HISTORY_KEEP = 50;
  let historyAt = 0;

  const featureNames = (md) => Core.progressList(md).map((x) => x.name);

  async function keepVersion(prev, next) {
    if (!prev || !prev.trim() || prev === next || !S.folder.handle || S.folder.handle.server) return;
    const lost = featureNames(prev).some((n) => featureNames(next).indexOf(n) < 0);
    if (!lost && Date.now() - historyAt < HISTORY_GAP) return;
    const name = Core.timeStamp() + '-' + featureFile();
    try {
      await Folder.write(S.folder.handle, ['.shupian', 'history'], name, prev);
      if (!S.folder.handle.server) await Folder.historyPrune(S.folder.handle, featureFile(), HISTORY_KEEP);
      historyAt = Date.now();
    } catch (e) {
      toast(t('could_not_save_the_history_why', { why: errText(e) }));
    }
  }

  // kind：plan 或 features
  async function pushDoc(kind) {
    const d = docs[kind];
    if (!d.md.trim() || d.virtual) return;
    const key = kind === 'plan' ? 'synced' : 'fsynced';
    const file = kind === 'plan' ? S.folder.file : featureFile();
    if (!file || d.md === S.folder[key]) return;
    try {
      if (kind === 'features') await keepVersion(S.folder.fsynced, d.md);
      await Folder.write(S.folder.handle, [], file, d.md);
      S.folder[key] = d.md;
    } catch (e) {
      toast(t('could_not_save_to_the_folder_why', { why: errText(e) }));
    }
  }

  async function folderPush() {
    if (S.folder.state !== 'ready') return;
    await pushDoc('plan');
    await pushDoc('features');
  }

  // 在某一份文档上提交（拉取回来的内容放进对应那一份的撤销记录里）
  function commitTo(kind, md) {
    const keep = S.doc;
    S.doc = kind;
    commit(md, true);
    S.doc = keep;
  }

  // 有文字框正在编辑时，自动检查不替换页面
  const editing = () => !!body.querySelector('textarea');

  // 把文件夹里的一份读回来：kind 是 plan 或 features；返回 true 表示页面内容变了
  async function pullDoc(kind, manual, silent) {
    const d = docs[kind];
    const key = kind === 'plan' ? 'synced' : 'fsynced';
    let found;
    try {
      found = kind === 'plan' ? await findPlan(S.folder.handle) : await findFeatures();
    } catch (e) {
      if (!silent) toast(t('could_not_read_the_folder_why', { why: errText(e) }));
      return false;
    }
    if (kind === 'plan') S.folder.file = found.name;
    const text = found.text;
    const mine = d.virtual ? '' : d.md;
    if (text == null) {
      if (mine.trim()) await pushDoc(kind);
      else if (manual && kind === 'plan' && !d.md.trim()) toast(t('there_is_no_plan_in_the_folder_yet'));
      return false;
    }
    if (text === mine) {
      S.folder[key] = text;
      if (manual && kind === 'plan') toast(t('already_up_to_date'));
      return false;
    }
    // 文件夹里是空的：空的不算最新，保留页面里的并写回去
    if (!text.trim() && mine.trim()) { S.folder[key] = text; await pushDoc(kind); return false; }
    if (!mine.trim() || mine === S.folder[key]) {
      if (silent && editing()) return false;
      if (kind === 'features') await keepVersion(mine || S.folder[key], text);
      S.folder[key] = text;
      d.virtual = false;
      commitTo(kind, text);
      S.editedAt = found.mtime || 0;
      persist();
      S.lastSync = clockText();
      if (!silent) toast(kind === 'plan' ? t('loaded_the_plan_from_the_folder') : t('loaded_the_feature_list_from_the_folder'), { label: t('undo'), run: () => { undo(); folderPush(); } });
      return true;
    }
    if (text === S.folder[key]) { await pushDoc(kind); return false; }
    if (silent && editing()) return false;
    // 两边都改过：不问，按先后合并。改在不同位置的都保留，改在同一位置的用较新的那一份。
    const remoteNewer = (found.mtime || 0) > (S.editedAt || 0);
    const merged = Core.merge3(S.folder[key], mine, text, remoteNewer ? 'theirs' : 'mine');
    if (kind === 'features') await keepVersion(mine, merged.text);
    S.folder[key] = text;
    commitTo(kind, merged.text);
    S.editedAt = Date.now();
    S.lastSync = clockText();
    if (merged.text !== text) await pushDoc(kind);
    toast(merged.conflicts ? t('both_the_folder_and_the_page_changed_merged', { n: merged.conflicts }) : t('both_the_folder_and_the_page_changed_merged_2'),
      { label: t('undo'), run: () => { undo(); folderPush(); } });
    return true;
  }

  // silent：自动检查时不弹提示。先读计划书，再读它的功能清单
  async function folderPull(manual, silent) {
    if (S.folder.state !== 'ready') return;
    const a = await pullDoc('plan', manual, silent);
    deriveFeatures();
    const b = await pullDoc('features', manual, silent);
    // 还没自己选过看哪一份时，有功能清单就先看功能清单
    if (!S.picked && S.doc === 'plan' && docs.features.md.trim()) S.doc = 'features';
    if (S.doc === 'features' && !docs.features.md.trim()) S.doc = 'plan';
    if (a || b || !silent) renderAll();
  }

  function clockText() {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0');
  }

  // ---------- 文字显示 ----------

  function headingNumbers(lines) {
    const set = {};
    lines.forEach((l) => {
      const ti = Core.info(l);
      if (ti.kind !== 'h') return;
      const m = /^(\d+(?:\.\d+)?)\b/.exec(ti.body);
      if (m) set[m[1]] = true;
    });
    return set;
  }

  function openFolds(el) {
    let p = el.parentElement;
    while (p && p !== body) {
      if (p.classList.contains('sec') && p.classList.contains('closed')) { p.classList.remove('closed'); growAll(p); }
      p = p.parentElement;
    }
  }

  function jumpTo(selector) {
    const el = body.querySelector(selector);
    if (!el) return;
    openFolds(el);
    el.scrollIntoView({ block: 'start' });
  }

  function inline(text, nums) {
    const frag = document.createDocumentFragment();
    const re = new RegExp('((?:' + Core.TBD_ALT + ')[：:][^；;。\\n]*|〈[^〉]*〉|\\d+\\.\\d+)', 'g');
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
      const tok = m[0];
      if (m.index > last) frag.append(document.createTextNode(text.slice(last, m.index)));
      const prev = m.index > 0 ? text.charAt(m.index - 1) : '';
      if (Core.TBD_START_RE.test(tok)) frag.append(h('span', { class: 'pend', text: tok }));
      else if (tok.charAt(0) === '〈') frag.append(h('span', { class: 'ph', text: tok }));
      else if (nums[tok] && !/[\d.]/.test(prev)) frag.append(h('button', { type: 'button', class: 'ref', onclick() { jumpTo('[data-no="' + tok + '"]'); } }, tok));
      else frag.append(document.createTextNode(tok));
      last = m.index + tok.length;
    }
    if (last < text.length) frag.append(document.createTextNode(text.slice(last)));
    return frag;
  }

  function renderLines(text, nums, lang) {
    const lines = Core.split(text);
    const wrap = h('div', { class: 'lines' });
    const tbd = LOCALES[lang].doc.tbd + LOCALES[lang].doc.sep + LOCALES[lang].doc.missing;
    lines.forEach((l, i) => {
      const ti = Core.info(l);
      if (ti.kind === 'blank' || ti.kind === 'hr') return;
      if (ti.kind === 'li') {
        const lv = Core.splitLabel(ti.body);
        const row = h('div', { class: 'li', style: 'margin-left:' + Math.min(6, Math.floor(ti.indent / 2)) * 1.1 + 'em' }, h('span', { class: 'mk', text: ti.ordered ? ti.marker : '•' }));
        const tx = h('span', { class: 'tx' });
        if (lv) tx.append(h('span', { class: 'lb', text: lv.label + (lang === 'zh' ? '：' : ': ') }), inline(lv.value, nums));
        else tx.append(inline(ti.body, nums));
        row.append(tx);
        wrap.append(row);
        return;
      }
      const lv = Core.splitLabel(ti.body);
      const row = h('div', { class: 'kv' });
      if (lv) {
        row.append(h('span', { class: 'lb', text: lv.label + (lang === 'zh' ? '：' : ': ') }));
        let nx = i + 1;
        while (nx < lines.length && Core.info(lines[nx]).kind === 'blank') nx++;
        const hasList = nx < lines.length && Core.info(lines[nx]).kind === 'li';
        if (lv.value.trim() === '' && !hasList) row.append(h('span', { class: 'pend', text: tbd + lv.label }));
        else row.append(inline(lv.value, nums));
      } else row.append(inline(ti.body, nums));
      wrap.append(row);
    });
    return wrap;
  }

  // 块的位置按元素上的 data-line 读；增删行后后面的块被平移
  function shiftLines(after, delta) {
    if (!delta) return;
    Array.prototype.forEach.call(body.querySelectorAll('[data-line]'), (el) => {
      const n = Number(el.getAttribute('data-line'));
      if (n > after) el.setAttribute('data-line', String(n + delta));
    });
  }

  // 有可选项的字段（字段表第 4 列）：在填写框上方给一排可点选的选项，点一下写进对应的那一行，可以多选
  function optionRows(ta, sec) {
    const lang = docLangOf(S.md);
    const doc = LOCALES[lang].doc;
    const fields = (((SCHEMA[lang] || SCHEMA.zh).fields || {})[sec] || []).filter((r) => r.options && r.options.length);
    if (!fields.length) return null;
    const box = h('div', { class: 'optrows' });
    const reLine = (name) => new RegExp('^\\s*' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[：:]\\s*(.*)$');
    const read = (name) => {
      const hit = ta.value.split('\n').map((l) => reLine(name).exec(l)).filter(Boolean)[0];
      return hit ? hit[1].split(/[、,，;；]\s*/).map((x) => x.trim()).filter(Boolean) : [];
    };
    const write = (name, values) => {
      const lines = ta.value.split('\n');
      const text = name + doc.sep + values.join(doc.listSep);
      const i = lines.findIndex((l) => reLine(name).test(l));
      if (i >= 0) lines[i] = text;
      else lines.push(text);
      ta.value = lines.join('\n');
      ta.dispatchEvent(new Event('input'));
      paint();
    };
    const paint = () => {
      clear(box);
      fields.forEach((r) => {
        const cur = read(r.name);
        box.append(h('div', { class: 'optrow' },
          h('span', { class: 'lb', text: r.name }),
          r.options.map((o) => {
            const on = cur.indexOf(o) >= 0;
            const b = h('button', { type: 'button', class: 'chip' + (on ? ' on' : ''), 'aria-pressed': on ? 'true' : 'false' }, o);
            // 不让填写框失去焦点，否则这一块会退出编辑
            b.addEventListener('mousedown', (e) => e.preventDefault());
            b.addEventListener('click', () => {
              const now = read(r.name);
              const next = on ? now.filter((x) => x !== o) : r.options.filter((x) => x === o || now.indexOf(x) >= 0).concat(now.filter((x) => r.options.indexOf(x) < 0));
              write(r.name, next);
            });
            return b;
          })));
      });
    };
    ta.addEventListener('input', paint);
    paint();
    return box;
  }

  // 点一下变成大填写框，点框外保存
  // readonly：初始计划书只读，不能点开编辑
  function makeBox(line, sec, nums, readonly) {
    const el = h('div', Object.assign({ class: 'box' + (readonly ? ' readonly' : ''), 'data-line': line }, readonly ? {} : { tabindex: 0, role: 'button', 'aria-label': t('click_to_edit') }));
    const at = () => Number(el.getAttribute('data-line'));
    const paint = () => {
      clear(el);
      const text = Core.bodyText(Core.split(S.md), at());
      if (!text.trim()) {
        if (!readonly) el.append(h('div', { class: 'hint-note' }, t('click_to_fill_in')), h('pre', { class: 'hint-lines', text: sectionHint(S.md, sec) }));
      } else el.append(renderLines(text, nums, docLangOf(S.md)));
    };
    const edit = () => {
      if (el.querySelector('textarea')) return;
      const text = Core.bodyText(Core.split(S.md), at());
      const ta = h('textarea', { class: 'in big', placeholder: sectionHint(S.md, sec), value: text, 'aria-label': t('content') });
      const choices = optionRows(ta, sec);
      ta.addEventListener('input', () => {
        autoGrow(ta);
        const before = Core.split(S.md).length;
        typing(Core.setBody(S.md, at(), ta.value), 'b' + at());
        shiftLines(at(), Core.split(S.md).length - before);
      });
      ta.addEventListener('blur', paint);
      ta.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); ta.blur(); } });
      clear(el);
      if (choices) el.append(choices);
      el.append(ta);
      autoGrow(ta);
      // 光标放在文末，但不让页面跟着滚到文末（框比窗口高时会跳到框底部）
      ta.focus({ preventScroll: true });
      ta.setSelectionRange(ta.value.length, ta.value.length);
    };
    if (!readonly) {
      el.addEventListener('click', (e) => { if (!e.target.closest('button') && !el.querySelector('textarea')) edit(); });
      el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); edit(); } });
      el.edit = edit;
    }
    paint();
    return el;
  }

  function nameSlot(label, placeholder, run) {
    const slot = h('div', { class: 'addslot' });
    const showButton = () => {
      clear(slot);
      slot.append(h('button', { type: 'button', class: 'btn', onclick: showForm }, '＋ ' + label));
    };
    const showForm = () => {
      clear(slot);
      const input = h('input', { class: 'in', placeholder, 'aria-label': placeholder });
      const err = h('p', { class: 'err', style: 'display:none' });
      const go = () => {
        const r = run(input.value);
        if (r && !r.ok) { err.textContent = r.error; err.style.display = ''; input.focus(); }
      };
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); go(); }
        if (e.key === 'Escape') { e.stopPropagation(); showButton(); }
      });
      slot.append(h('div', { class: 'addrow' }, input,
        h('button', { type: 'button', class: 'btn primary', onclick: go }, t('add')),
        h('button', { type: 'button', class: 'btn', onclick: showButton }, t('cancel'))), err);
      input.focus();
    };
    showButton();
    return slot;
  }

  function afterAdd(line) {
    renderBody();
    const el = body.querySelector('[data-line="' + line + '"]');
    if (!el) return;
    openFolds(el);
    el.scrollIntoView({ block: 'center' });
    const box = el.classList.contains('box') ? el : el.querySelector('.box');
    if (box && box.edit) box.edit();
  }

  function renameInline(btn, current, run) {
    const input = h('input', { class: 'in', value: /〈/.test(current) ? '' : current, placeholder: t('name'), 'aria-label': t('name') });
    let done = false;
    const finish = (save) => {
      if (done) return;
      done = true;
      if (save && input.value.trim() !== current) run(input.value);
      renderAll();
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') finish(true); if (e.key === 'Escape') { e.stopPropagation(); finish(false); } });
    input.addEventListener('blur', () => finish(true));
    btn.replaceWith(input);
    input.focus();
    input.select();
  }

  // 未提交的问题草稿：连了文件夹时存在文件夹里（悬浮窗读同一份），否则存在浏览器本地；写入按顺序排队
  let draftChain = Promise.resolve();
  let draftExists = false;

  function draftHandle() {
    return S.folder.state === 'ready' && S.folder.handle && S.folder.file ? S.folder.handle : null;
  }

  async function loadDraft() {
    const handle = draftHandle();
    if (!handle) return LS.get(NS + ':draft:' + S.project.id, []);
    const text = await Folder.read(handle, Draft.sub, Draft.name(S.folder.file));
    return text ? Draft.parse(text) : [];
  }

  function queueDraft(rows) {
    if (!rows.length && !draftExists) return;
    draftExists = rows.length > 0;
    const handle = draftHandle();
    const file = S.folder.file;
    const key = NS + ':draft:' + S.project.id;
    draftChain = draftChain.then(async () => {
      if (handle) await Folder.write(handle, Draft.sub, Draft.name(file), Draft.text(rows));
      else if (!LS.set(key, rows)) throw new Error(t('browser_storage_is_full_and_the_latest'));
    }).catch((e) => toast(t('could_not_save_the_draft_why', { why: errText(e) })));
  }

  // 写问题：多行输入固定在窗口最下面（在滚动区之外），和功能清单同屏；每条问题可以 @ 多个功能；没提交的内容留作草稿
  let composerFeats = [];
  let composerKey = '';
  let composerSig = '';
  let composerLang = '';
  let draftTimer = 0;
  const featIs = (a, b) => !!(a && b && a.no === b.no && a.name === b.name);
  const composer = createIssueList({
    kit,
    features: () => composerFeats,
    placeholder: () => t('describe_the_issue_you_can_several_features'),
    onChange() {
      clearTimeout(draftTimer);
      draftTimer = setTimeout(() => queueDraft(composer.snapshot()), 500);
    },
  });

  function submitIssues() {
    const items = composer.items();
    if (!items.length) { toast(t('write_the_issue_first')); return; }
    if (items.some((x) => !x.fs.length)) { toast(t('choose_a_feature_for_every_issue')); return; }
    // 一条问题 @ 了几个功能，就记到每个功能下面
    const flat = [];
    items.forEach((x) => x.fs.forEach((f) => flat.push({ featureLine: f.featureLine, text: x.text })));
    // 计划书已确认、还没有功能清单：第一条问题就是开始做，问题记在新生成的功能清单里
    if (S.doc === 'plan' && Core.getStatus(S.md) === 'approved') {
      const before = Core.progressList(S.md);
      startWork();
      const after = Core.progressList(S.md);
      flat.forEach((x) => {
        const f = before.filter((b) => b.line === x.featureLine)[0];
        const hit = f && after.filter((a) => a.no === f.no && a.name === f.name)[0];
        if (hit) x.featureLine = hit.line;
      });
    }
    const r = Core.addIssues(S.md, flat, Core.today());
    if (!r.ok) { toast(t('write_the_issue_first')); return; }
    clearTimeout(draftTimer);
    queueDraft([]);
    // 记问题、改进度不算改计划书
    commit(r.md, true);
    const keep = composer.defaultF;
    renderAll();
    composer.reset(composerFeats.filter((x) => featIs(x, keep))[0] || composerFeats[0] || null);
    toast(t('added_n_issues', { n: r.added }));
  }

  // 点功能清单里的一个功能：当前这一条问题 @ 它，之后新加的也默认是它
  function pickTarget(f) {
    const hit = composerFeats.filter((x) => featIs(x, f))[0];
    if (!hit) return;
    const row = composer.focusedRow();
    if (!row.text.trim()) row.fs = [hit];
    else if (!row.fs.some((x) => featIs(x, hit))) row.fs.push(hit);
    composer.defaultF = hit;
    composer.paint();
    renderAll();
    row.ta.focus({ preventScroll: true });
  }

  function buildComposer() {
    clear(composerEl);
    composerEl.setAttribute('role', 'group');
    composerEl.setAttribute('aria-label', t('report_an_issue'));
    composerEl.append(h('div', { class: 'composer-in' },
      composer.el,
      h('div', { class: 'composer-submit' }, h('button', { type: 'button', class: 'btn primary', onclick: submitIssues }, t('submit')))));
  }

  // 只在有功能可以写问题的页面显示；输入的内容在切换页面、重画时保持不动
  function renderComposer() {
    const show = S.view === 'plan' && !!S.md.trim() && !planLocked() && Core.progressList(S.md).length > 0;
    composerEl.style.display = show ? '' : 'none';
    if (!show) return;
    const langChanged = composerLang !== LANG;
    if (langChanged) { composerLang = LANG; buildComposer(); }
    const feats = Core.issueList(S.md);
    const sig = feats.map((f) => f.no + '|' + f.name).join('\n');
    const key = S.project.id + '|' + S.folder.file;
    composerFeats = feats;
    if (key !== composerKey) {
      composerKey = key;
      composerSig = sig;
      draftExists = false;
      composer.reset(feats[0] || null);
      loadDraft().then((rows) => {
        if (rows.length && !composer.items().length) { draftExists = true; composer.restore(rows); }
      }, (e) => toast(t('could_not_load_the_draft_why', { why: errText(e) })));
      return;
    }
    if (sig !== composerSig) {
      composerSig = sig;
      const keep = composer.defaultF ? feats.filter((x) => featIs(x, composer.defaultF))[0] : null;
      composer.syncTargets(keep || feats[0] || null);
    } else if (langChanged) {
      composer.paint();
    }
  }

  // 点问题的文字：变成输入框，改完点别处保存；状态前缀保留
  function editIssueText(btn, it) {
    const ta = h('textarea', { class: 'in', rows: 1, value: it.text, 'aria-label': t('issue_description') });
    let done = false;
    const finish = (save) => {
      if (done) return;
      done = true;
      const v = ta.value.replace(/\s+/g, ' ').trim();
      if (save && v && v !== it.text) {
        const lines = Core.split(S.md);
        const info = Core.info(lines[it.line]);
        const prefix = Core.issuePrefix(S.md, it.state);
        lines[it.line] = ' '.repeat(info.indent) + info.marker + ' ' + prefix + v;
        commit(Core.join(lines), true);
      }
      renderAll();
    };
    ta.addEventListener('input', () => autoGrow(ta));
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); finish(true); }
      if (e.key === 'Escape') { e.stopPropagation(); finish(false); }
    });
    ta.addEventListener('blur', () => finish(true));
    btn.replaceWith(ta);
    autoGrow(ta);
    ta.focus({ preventScroll: true });
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }

  // 确认之后在功能清单里直接加功能：填名称，加完直接进入编辑
  function openAddFeature() {
    const input = h('input', { class: 'in', placeholder: t('feature_name'), 'aria-label': t('feature_name') });
    const err = h('p', { class: 'err', style: 'display:none' });
    let closeModal = null;
    const go = () => {
      const r = Core.addBlock(S.md, 'feature', input.value);
      if (!r.ok) { err.textContent = nameError(r.code, 'feature'); err.style.display = ''; input.focus({ preventScroll: true }); return; }
      closeModal();
      // 新加的功能还没做，要让它在清单里看得到
      S.collapsed.__later = true;
      commit(r.md, true);
      afterAdd(r.line);
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    kit.openModal({
      title: t('add_a_feature'),
      small: true,
      body: h('div', null, input, err),
      foot: (close) => {
        closeModal = close;
        return [
          h('button', { type: 'button', class: 'btn', onclick: close }, t('cancel')),
          h('button', { type: 'button', class: 'btn primary', onclick: go }, t('add')),
        ];
      },
    });
    setTimeout(() => input.focus({ preventScroll: true }), 0);
  }

  // 开始做之后有功能清单，初始计划书不再改，只读
  const planLocked = () => S.doc === 'plan' && docs.features.md.trim() !== '';

  // 项目情况（计划书阶段）和功能清单（开始做之后）：每个功能做什么、做到哪一步，以及它下面的问题
  function renderProgress() {
    if (planLocked()) return null;
    const list = Core.progressList(S.md);
    if (!list.length) return null;
    const lang = docLangOf(S.md);
    const W = Core.WORDS[lang].progress;
    const building = S.doc === 'features';
    const issues = Core.issueList(S.md);
    const done = list.filter((x) => x.status === 'done').length;
    const doing = list.filter((x) => x.status === 'doing').length;
    const open = issues.reduce((n, f) => n + f.items.filter((i) => i.state !== 'done').length, 0);
    const box = h('section', { class: 'status-box' });
    box.append(h('div', { class: 'status-head' },
      h('h2', { text: building ? t('feature_list') : t('project_status') }),
      h('span', { class: 'muted', text: t('done_of_total_done_doing_in_progress', { done, total: list.length, doing }) + (open ? '　' + t('n_open_issues', { n: open }) : '') }),
      building ? h('button', { type: 'button', class: 'btn sm', onclick: openAddFeature }, t('add_a_feature')) : null));
    box.append(h('div', { class: 'bar-track' },
      h('span', { class: 'bar-done', style: 'width:' + (done / list.length) * 100 + '%' }),
      h('span', { class: 'bar-doing', style: 'width:' + (doing / list.length) * 100 + '%' })));
    const addRow = (f) => {
      const chip = h('button', { type: 'button', class: 'prog ' + f.status, title: t('click_to_change_progress') }, W[f.status]);
      chip.addEventListener('click', () => {
        const next = Core.nextProgress(f.status);
        // 计划书已确认后第一次改进度就是开始做了：生成功能清单，进度记在功能清单里
        if (S.doc === 'plan' && Core.getStatus(S.md) === 'approved') {
          startWork();
          const hit = Core.progressList(S.md).filter((x) => x.no === f.no && x.name === f.name)[0];
          if (hit) commit(Core.setProgress(S.md, hit.line, next), true);
          renderAll();
          return;
        }
        commit(Core.setProgress(S.md, f.line, next), true);
        renderAll();
      });
      const mine = (issues.filter((x) => x.featureLine === f.line)[0] || { items: [] }).items;
      // 功能清单里点名字是选中它去写问题；计划书阶段点名字跳到它在计划书里的位置
      const label = (f.no ? f.no + ' ' : '') + f.name;
      const name = building
        ? h('button', { type: 'button', class: 'ref' + (featIs(composer.defaultF, f) ? ' on' : ''), title: t('click_to_pick_the_feature'), onclick: () => pickTarget(f) }, label)
        : h('button', { type: 'button', class: 'ref', onclick() { jumpTo('[data-no="' + f.no + '"]'); } }, label);
      box.append(h('div', { class: 'status-row' },
        h('div', { class: 'status-name' }, name, f.what ? h('span', { class: 'muted', text: f.what }) : null),
        chip));
      // 每条问题：点状态在 待处理 / 处理中 / 已修 之间切换；点文字可以改；AI 处理时这里实时变化
      mine.forEach((it) => {
        const key = f.line + ':' + it.text;
        const was = S.issueSeen[key];
        const flash = was && was !== 'done' && it.state === 'done';
        S.issueSeen[key] = it.state;
        const stateBtn = h('button', { type: 'button', class: 'btn sm istate ' + it.state, title: t('click_to_change_the_status'), onclick() {
          commit(Core.setIssueState(S.md, it.line, Core.nextIssueState(it.state)), true);
          renderAll();
        } }, it.state === 'done' ? '✓ ' + t('fixed') : it.state === 'doing' ? t('working') : t('to_do'));
        const text = h('button', { type: 'button', class: 'issue-text link', title: t('click_to_edit'), 'aria-label': t('click_to_edit') }, it.text);
        text.addEventListener('click', () => editIssueText(text, it));
        box.append(h('div', { class: 'issue ' + it.state + (flash ? ' flash' : '') },
          stateBtn, text,
          h('button', { type: 'button', class: 'x', title: t('delete'), 'aria-label': t('delete'), onclick() {
            commit(Core.join(Core.deleteSubtree(Core.split(S.md), it.line)), true);
            renderAll();
            toast(t('deleted'), { label: t('undo'), run: () => undo() });
          } }, '✕')));
      });
    };
    // 功能清单是已经有的东西：做出来的在上面，还没做的收起放在下面；计划书阶段全部列出
    // 功能下已经记了问题的，即使还没做也列在上面，不然问题看不到
    const hasIssues = (f) => ((issues.filter((x) => x.featureLine === f.line)[0] || { items: [] }).items.length > 0);
    const built = building ? list.filter((x) => x.status !== 'todo' || hasIssues(x)) : list;
    const later = building ? list.filter((x) => x.status === 'todo' && !hasIssues(x)) : [];
    built.forEach(addRow);
    if (building && !built.length) box.append(h('p', { class: 'muted', text: t('nothing_built_yet') }));
    if (later.length) {
      const openLater = S.collapsed.__later === true;
      box.append(h('button', { type: 'button', class: 'link later-toggle', onclick() { S.collapsed.__later = !openLater; renderAll(); } }, (openLater ? '▾ ' : '▸ ') + t('not_built_yet', { n: later.length })));
      if (openLater) later.forEach(addRow);
    }
    return box;
  }

  function renderPlan() {
    const lines = Core.split(S.md);
    const nums = headingNumbers(lines);
    const hs = Core.headings(lines);
    const lang = docLangOf(S.md);
    const locked = planLocked();
    const inFeatures = S.doc === 'features';
    const doc = h('div', { class: 'doc' });
    const title = hs.filter((x) => x.level === 1)[0];
    if (title) {
      const nm = Core.titleName(S.md);
      if (locked || inFeatures) {
        doc.append(h('h1', null, h('span', { class: 'title', 'data-line': title.line }, nm || t('untitled_project'))));
      } else {
        const nameBtn = h('button', { type: 'button', class: 'title', 'data-line': title.line, title: t('click_to_rename') }, nm || t('untitled_project'));
        nameBtn.addEventListener('click', () => renameInline(nameBtn, nm, (v) => { if (v.trim()) commit(Core.setTitle(S.md, v)); }));
        doc.append(h('h1', null, nameBtn));
      }
    }
    if (docs.features.md.trim()) {
      const tabs = h('div', { class: 'doctabs', role: 'tablist' });
      [['features', t('feature_list')], ['plan', t('initial_plan')]].forEach(([kind, label]) => {
        const on = S.doc === kind;
        tabs.append(h('button', { type: 'button', role: 'tab', class: 'chip' + (on ? ' on' : ''), 'aria-selected': on ? 'true' : 'false', onclick() {
          if (on) return;
          S.doc = kind;
          S.picked = true;
          renderAll();
        } }, label));
      });
      doc.append(tabs);
    }
    doc.append(h('div', { class: 'statusline' }));
    const prog = renderProgress();
    if (prog) doc.append(prog);
    let secBody = null;
    hs.forEach((x, idx) => {
      if (x.level === 2) {
        const no = (/^(\d+)\b/.exec(x.body) || [])[1] || '';
        const closedNow = S.collapsed[x.body] !== undefined ? S.collapsed[x.body] : (inFeatures || locked);
        const secEl = h('section', { class: 'sec' + (closedNow ? ' closed' : ''), 'data-line': x.line, 'data-no': no });
        const fold = h('button', { type: 'button', class: 'fold', 'aria-label': t('expand_or_collapse') }, closedNow ? '▸' : '▾');
        fold.addEventListener('click', () => {
          const closed = secEl.classList.toggle('closed');
          S.collapsed[x.body] = closed;
          fold.textContent = closed ? '▸' : '▾';
          if (!closed) growAll(secEl);
        });
        secEl.append(h('div', { class: 'sec-head' }, h('h2', null, inline(x.body, nums)), fold));
        secBody = h('div', { class: 'sec-body' });
        secEl.append(secBody);
        const next = hs[idx + 1];
        const hasChildren = next && next.level >= 3;
        if (!hasChildren || Core.bodyText(lines, x.line).trim() !== '') secBody.append(makeBox(x.line, no, nums, locked));
        if (ADD_LABEL[no] && !locked) {
          const slot = no === '2'
            ? h('div', { class: 'addslot' }, h('button', { type: 'button', class: 'btn', onclick() {
              const r = Core.addFlowLine(S.md);
              if (r.ok) { commit(r.md); afterAdd(x.line); }
            } }, '＋ ' + t(ADD_LABEL[no])))
            : nameSlot(t(ADD_LABEL[no]), no === '3' ? t('page_name') : t('feature_name'), (name) => {
              const kind = no === '3' ? 'page' : 'feature';
              const r = Core.addBlock(S.md, kind, name);
              if (!r.ok) return { ok: false, error: nameError(r.code, kind) };
              commit(r.md);
              afterAdd(r.line);
              return r;
            });
          secBody.append(slot);
        }
        doc.append(secEl);
      } else if (x.level === 3 && secBody) {
        const no = (/^(\d+\.\d+)\b/.exec(x.body) || [])[1] || '';
        const sec = (/^(\d+)\./.exec(no) || [])[1] || '';
        const card = h('div', { class: 'blk', 'data-line': x.line, 'data-no': no });
        const titleText = x.body.replace(/^\d+\.\d+\s*/, '');
        const nameParts = [h('span', { class: 'no', text: no }), titleText && !/〈/.test(titleText) ? h('span', { text: titleText }) : h('span', { class: 'ph', text: t('name') })];
        if (locked) {
          card.append(h('div', { class: 'blk-head' }, h('span', { class: 'blk-title' }, nameParts)), makeBox(x.line, sec, nums, true));
        } else {
          const nameBtn = h('button', { type: 'button', class: 'blk-title', title: t('click_to_rename') }, nameParts);
          nameBtn.addEventListener('click', () => renameInline(nameBtn, titleText, (v) => {
            const r = Core.renameBlock(S.md, Number(card.getAttribute('data-line')), v);
            if (r.ok) commit(r.md); else toast(nameError(r.code, sec === '3' ? 'page' : 'feature'));
          }));
          const del = h('button', { type: 'button', class: 'x', title: t('delete'), 'aria-label': t('delete'), onclick() {
            commit(Core.join(Core.deleteSubtree(Core.split(S.md), Number(card.getAttribute('data-line')))));
            renderAll();
            toast(t('deleted'), { label: t('undo'), run: () => undo() });
          } }, '✕');
          card.append(h('div', { class: 'blk-head' }, nameBtn, del), makeBox(x.line, sec, nums));
        }
        const slot = secBody.querySelector('.addslot');
        if (slot) secBody.insertBefore(card, slot); else secBody.append(card);
      }
    });
    return doc;
  }

  // ---------- 导入、导出、复制 ----------

  function exportText() {
    return Core.normalizeForExport(S.md);
  }

  function exportPlan() {
    if (!S.md.trim()) { toast(t('there_is_nothing_to_export')); return; }
    const base = (S.project.name || 'plan').replace(/[\\/:*?"<>|\s]+/g, '-');
    toast(t('exported_name', { name: download(exportText(), base, 'md') }));
  }

  function openImport() {
    const ta = h('textarea', { class: 'in big', placeholder: t('paste_the_plan_or_choose_a_file'), 'aria-label': t('content_to_import') });
    const file = h('input', { type: 'file', accept: '.md,.txt,text/markdown,text/plain', style: 'position:fixed;left:0;top:0;opacity:0;width:1px;height:1px' });
    file.addEventListener('change', () => {
      const f = file.files && file.files[0];
      if (!f) return;
      readText(f).then((txt) => { ta.value = txt; autoGrow(ta); }, () => toast(t('this_file_cannot_be_read_check_that_it_is_a')));
    });
    app.append(file);
    kit.openModal({
      title: t('import'),
      body: ta,
      onClose() { file.remove(); },
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('cancel')),
        h('button', { type: 'button', class: 'btn', onclick: () => file.click() }, t('choose_a_file')),
        h('button', { type: 'button', class: 'btn primary', onclick() {
          if (!ta.value.trim()) { toast(t('paste_something_or_choose_a_file_first')); return; }
          close();
          importText(ta.value);
        } }, t('import')),
      ],
    });
    setTimeout(() => ta.focus(), 0);
  }

  function importText(text) {
    S.doc = 'plan';
    const txt = text.replace(/\r\n?/g, '\n');
    if (!/^##\s+\d/m.test(txt)) {
      const wrapped = Core.wrapUnrecognised(txt, S.project.name, LANG, Core.today());
      commit(wrapped, true);
      renderAll();
      toast(t('the_plan_format_was_not_recognised_the'), { label: t('undo'), run: () => undo() });
      return;
    }
    commit(txt, true);
    settleDocs();
    renderAll();
    toast(t('plan_imported'), { label: t('undo'), run: () => undo() });
  }

  function newBlank() {
    S.doc = 'plan';
    commit(Core.blankPlan(SCHEMA[LANG].planTemplate, S.project.name === t('new_project') ? '' : S.project.name, Core.today()), true);
    renderAll();
    toast(t('new_plan_created'), { label: t('undo'), run: () => undo() });
  }

  function loadExample() {
    S.doc = 'plan';
    commit(SCHEMA[LANG].example, true);
    settleDocs();
    renderAll();
    toast(t('example_loaded'), { label: t('undo'), run: () => undo() });
  }

  // 给 AI 的话默认用英文写，可以切换成别的语言（和界面语言无关）
  function openAiPrompt() {
    let promptLang = LOCALES.en ? 'en' : LANG;
    const note = h('textarea', { class: 'in', rows: 3, placeholder: t('describe_what_you_want_to_make'), 'aria-label': t('notes') });
    const out = h('textarea', { class: 'in big', readonly: true, 'aria-label': t('words_for_the_ai') });
    const langBtn = h('button', { type: 'button', class: 'lang', title: t('language'), 'aria-label': t('language') });
    const refresh = () => {
      langBtn.textContent = LOCALES[promptLang].name + ' ▾';
      out.value = Core.buildAiPrompt(S.md, SCHEMA, note.value, promptLang);
      autoGrow(out);
    };
    langBtn.addEventListener('click', () => {
      kit.openPop(langBtn, (pop) => {
        LANG_LIST.forEach((k) => pop.append(kit.popItem(LOCALES[k].name, () => { promptLang = k; refresh(); }, { on: promptLang === k })));
      });
    });
    note.addEventListener('input', () => { autoGrow(note); refresh(); });
    kit.openModal({
      title: t('copy_prompt'),
      body: h('div', null,
        h('div', { class: 'field' }, h('div', { class: 'fl', text: t('language') }), langBtn),
        h('div', { class: 'field' }, h('div', { class: 'fl', text: t('notes') }), note),
        h('div', { class: 'field' }, h('div', { class: 'fl', text: t('prompt_content') }), out)),
      foot: (close) => [
        h('button', { type: 'button', class: 'btn', onclick: close }, t('close')),
        h('button', { type: 'button', class: 'btn primary', onclick() { copyThen(kit, out.value, out); } }, t('copy')),
      ],
    });
    refresh();
  }

  // ---------- 页面外壳 ----------

  function pendJump() {
    const els = Array.prototype.slice.call(body.querySelectorAll('.pend'));
    if (!els.length) return;
    pendIndex = (pendIndex + 1) % els.length;
    const el = els[pendIndex];
    openFolds(el);
    el.scrollIntoView({ block: 'center' });
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 1400);
  }

  function renderStatus() {
    const box = body.querySelector('.statusline');
    if (!box) return;
    clear(box);
    const lang = docLangOf(S.md);
    const inFeatures = S.doc === 'features';
    const locked = planLocked();
    const code = inFeatures ? '' : Core.getStatus(S.md) || 'doing';
    const n = Core.countPending(S.md);
    if (!inFeatures) {
      const label = code === 'approved' ? (locked ? t('initial_plan_approved') : t('plan_confirmed')) : Core.statusLabel(code, lang);
      box.append(h('span', { class: 'state' + (code === 'approved' ? ' pass' : ''), text: label }));
    }
    if (!locked && !(inFeatures && n === 0)) {
      if (n > 0) box.append(h('button', { type: 'button', class: 'btn sm', onclick: pendJump }, t('n_left_to_fill_in', { n })));
      else box.append(h('span', { class: 'muted', text: t('nothing_left_to_fill_in') }));
    }
    if (!inFeatures && code !== 'approved') {
      box.append(h('button', { type: 'button', class: 'btn sm primary', onclick() {
        const r = Core.markPassed(S.md);
        if (!r.ok) { toast(t('n_still_to_fill_in_fill_them_in_before', { n: r.pending })); return; }
        commit(r.md, true);
        settleDocs();
        renderAll();
        toast(t('the_plan_is_confirmed_work_can_start'));
      } }, t('confirm_and_start')));
    }
    if (SERVER && S.folder.state !== 'ready' && S.md.trim()) {
      const save = h('button', { type: 'button', class: 'btn sm', onclick() { openSaveTo(save); } }, t('save_to_a_folder'));
      box.append(save);
    }
    if (S.folder.state === 'ready') {
      const label = t('folder_name_2', { name: S.folder.name });
      // 有地址时，文件夹名就是复制地址的地方，悬停显示完整地址
      if (S.folder.path) box.append(h('button', { type: 'button', class: 'link folder-path', title: S.folder.path, onclick() { copyThen(kit, S.folder.path); } }, label));
      else box.append(h('span', { class: 'muted', text: label }));
      if (S.lastSync) box.append(h('span', { class: 'muted', text: t('synced_at_time', { time: S.lastSync }) }));
      if (S.folder.path) {
        const planBtn = h('button', { type: 'button', class: 'btn sm', title: t('switch_or_create_a_plan'), onclick() { openPlanMenu(planBtn); } }, S.folder.file + ' ▾');
        box.append(planBtn, h('span', { class: 'muted', text: t('handy_for_opening_a_cli') }));
      }
    }
  }

  function openToc(anchor) {
    kit.openPop(anchor, (pop, close) => {
      Core.headings(Core.split(S.md)).filter((x) => x.level === 2 || x.level === 3).forEach((x) => {
        pop.append(h('button', { type: 'button', style: x.level === 3 ? 'padding-left:1.6em' : 'font-weight:700', onclick() {
          close();
          jumpTo('[data-line="' + x.line + '"]');
        } }, x.body));
      });
    });
  }

  // 历史版本：功能清单每次被改写之前存下的旧版本，可以整份恢复
  function stampText(name) {
    const m = /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})/.exec(name);
    return m ? m[1] + '-' + m[2] + '-' + m[3] + ' ' + m[4] + ':' + m[5] + ':' + m[6] : name;
  }

  async function openHistory() {
    let items;
    try {
      items = await Folder.historyList(S.folder.handle, featureFile());
    } catch (e) {
      toast(t('could_not_read_the_history_why', { why: errText(e) }));
      return;
    }
    if (!items.length) { toast(t('there_are_no_earlier_versions_yet')); return; }
    const now = featureNames(S.md);
    const rows = h('div', { class: 'hist' });
    const modal = kit.openModal({
      title: t('earlier_versions'),
      body: rows,
      foot: (close) => [h('button', { type: 'button', class: 'btn', onclick: close }, t('close'))],
    });
    for (const it of items) {
      let text;
      try {
        text = await Folder.read(S.folder.handle, ['.shupian', 'history'], it.name);
      } catch (e) {
        toast(t('could_not_read_the_history_why', { why: errText(e) }));
        return;
      }
      if (text == null) continue;
      const lost = featureNames(text).filter((n) => now.indexOf(n) < 0);
      rows.append(h('div', { class: 'hist-row' },
        h('div', { class: 'hist-info' },
          h('div', { text: stampText(it.name) }),
          lost.length ? h('div', { class: 'muted', text: t('removed_features_names', { names: lost.join(LOCALES[LANG].doc.listSep) }) }) : null),
        h('button', { type: 'button', class: 'btn sm', onclick() {
          modal.close();
          commit(text, true);
          renderAll();
          toast(t('restored_the_version', { time: stampText(it.name) }), { label: t('undo'), run: () => undo() });
        } }, t('restore'))));
    }
  }

  function openMenu(anchor) {
    kit.openPop(anchor, (pop) => {
      const add = (l, run, ex) => pop.append(kit.popItem(l, run, ex));
      const f = S.folder;
      const has = S.md.trim() !== '';
      if (has) {
        add(t('contents'), () => openToc(anchor));
        add(t('copy_everything'), () => showText(kit, t('full_plan'), exportText(), t('copy_it_and_send_it_to_the_ai')));
        add(t('copy_prompt'), openAiPrompt);
        add(t('export'), exportPlan);
        pop.append(h('hr'));
        if (S.doc === 'plan') {
          const keep = Core.hasOriginal(S.md);
          add(t('keep_the_original_description'), () => setOriginal(!keep), { on: keep, disabled: planLocked() });
        }
        if (S.doc === 'features' && f.state === 'ready') add(t('earlier_versions'), openHistory);
        pop.append(h('hr'));
      }
      add(t('view_an_example'), loadExample);
      add(t('new_blank_plan'), newBlank);
      add(t('import'), openImport);
      if (SERVER) add(t('install_the_browser_extension'), () => openExtensionHelp(kit));
      if (has) {
        add(t('undo'), () => { if (!undo()) toast(t('there_is_nothing_to_undo')); });
        add(t('redo'), () => { if (!redo()) toast(t('there_is_nothing_to_redo')); });
      }
      pop.append(h('hr'));
      if (f.state === 'off') add(t('folders_need_chrome_or_edge_on_a_computer'), () => {}, { disabled: true });
      else if (f.state === 'none' && SERVER) add(t('save_to_a_folder'), () => openSaveTo(anchor));
      else if (f.state === 'none') add(t('connect_a_folder'), folderConnect);
      else if (f.state === 'need') add(t('allow_the_folder_again'), folderRegrant);
      else {
        add(t('refresh'), () => folderPull(true, false));
        add(t('disconnect_the_folder'), folderDisconnect);
      }
      const closed = index.list.filter((p) => index.open.indexOf(p.id) < 0);
      if (closed.length) {
        pop.append(h('hr'));
        closed.forEach((p) => {
          pop.append(h('div', { class: 'row2' },
            h('button', { type: 'button', onclick() { kit.closePop(); useProject(p); } }, p.name),
            h('button', { type: 'button', class: 'x', title: t('delete_project'), onclick() { kit.closePop(); deleteProject(p.id); } }, '✕')));
        });
      }
      if (!SERVER) {
        pop.append(h('hr'));
        pop.append(h('a', { class: 'menu-link', href: 'download/prompt-plan-helper.exe', download: 'prompt-plan-helper.exe', onclick() { kit.closePop(); } }, t('download_the_desktop_version_windows')));
      }
    });
  }

  function openLang(anchor) {
    kit.openPop(anchor, (pop) => {
      LANG_LIST.forEach((k) => {
        pop.append(kit.popItem(LOCALES[k].name, () => { setLang(k); renderAll(); }, { on: LANG === k }));
      });
    });
  }

  function renderTabs() {
    const bar = h('div', { class: 'tabbar', role: 'tablist' });
    if (SERVER) {
      bar.append(h('button', { type: 'button', role: 'tab', class: 'chip' + (S.view === 'hub' ? ' on' : ''), onclick: showHub }, t('recent')));
    }
    index.open.forEach((id) => {
      const p = index.list.filter((x) => x.id === id)[0];
      if (!p) return;
      const on = S.view === 'plan' && S.project.id === id;
      bar.append(h('span', { class: 'tab' + (on ? ' on' : '') },
        h('button', { type: 'button', role: 'tab', class: 'tab-name', onclick() { if (!on) switchProject(id); } }, p.name),
        h('button', { type: 'button', class: 'tab-x', title: t('close_tab'), 'aria-label': t('close_tab'), onclick() { closeTab(id); } }, '✕')));
    });
    bar.append(h('button', { type: 'button', class: 'chip add', title: t('new_project'), 'aria-label': t('new_project'), onclick() { if (SERVER) showHub(); else createProject(); } }, '＋'));
    return bar;
  }

  function renderHead() {
    clear(head);
    const logo = document.createElement('span');
    logo.className = 'logo';
    logo.innerHTML = ICON_SVG;
    head.append(h('div', { class: 'in' },
      h('span', { class: 'brand' }, logo, h('span', { class: 'brand-name', text: t('prompt_plan_helper') })),
      h('span', { class: 'sp' }),
      h('button', { type: 'button', class: 'lang', title: t('language'), 'aria-label': t('language'), onclick(e) { openLang(e.currentTarget); } }, LOCALES[LANG].name + ' ▾'),
      h('button', { type: 'button', class: 'x more', title: t('more'), 'aria-label': t('more'), onclick(e) { openMenu(e.currentTarget); } }, '⋯')));
    head.append(h('div', { class: 'in tabs-in' }, renderTabs()));
  }

  // 在别的浏览器里打开的安装页：书签和扩展两种方式
  function renderInstallView() {
    const box = h('div', { class: 'col' });
    Api.call('GET', '/api/extension').then((info) => {
      box.append(h('h2', { text: t('install_the_floating_window') }), installContent(kit, info));
    }, (e) => toast(t('could_not_prepare_the_extension_why', { why: errText(e) })));
    return box;
  }

  function renderHubView() {
    const list = h('div', { class: 'folders' });
    folderRows(list, {
      kit,
      current: S.project && S.project.path ? S.project.path : '',
      onPick: (path) => connectFolderPath(path),
    });
    const actions = h('div', { class: 'row hub-actions' },
      h('button', { type: 'button', class: 'btn primary', onclick: newPlanHere }, t('new_plan')),
      h('button', { type: 'button', class: 'btn', onclick: () => newFolderFlow(connectFolderPath) }, t('new_folder')),
      h('button', { type: 'button', class: 'btn', async onclick() {
        const path = await pickFolderPath();
        if (path) connectFolderPath(path);
      } }, t('choose_another_folder')));
    return h('div', { class: 'col' }, actions, SERVER ? extensionRow(kit) : null, list);
  }

  // 作品署名：头像在左，三行说明在右；第二行和链接连成一句
  function creditBlock() {
    const second = t('credit_same');
    return h('div', { class: 'credit' },
      h('img', { class: 'credit-avatar', src: t('credit_avatar'), alt: '', width: 48, height: 48 }),
      h('div', { class: 'credit-text' },
        h('div', { text: t('credit_by') }),
        h('div', null,
          second ? h('span', { text: second }) : null,
          h('a', { class: 'link', href: t('credit_url'), target: '_blank', rel: 'noopener' }, t('credit_link')))));
  }

  function renderBody() {
    const st = body.scrollTop;
    kit.closePop();
    clear(body);
    let content;
    if (S.view === 'install') {
      content = renderInstallView();
    } else if (S.view === 'hub') {
      content = renderHubView();
    } else if (!S.md.trim()) {
      content = h('div', { class: 'col' }, h('div', { class: 'doc empty' },
        h('h1', { text: S.project.name || t('new_project') }),
        h('p', { class: 'muted', text: t('there_is_no_plan_yet') }),
        h('div', { class: 'row' },
          h('button', { type: 'button', class: 'btn primary', onclick: newBlank }, t('new_blank_plan')),
          h('button', { type: 'button', class: 'btn', onclick: loadExample }, t('view_an_example')),
          h('button', { type: 'button', class: 'btn', onclick: () => openImport() }, t('import')),
          Folder.supported() && S.folder.state !== 'ready' ? h('button', { type: 'button', class: 'btn', onclick: folderConnect }, t('connect_a_folder')) : null)));
    } else {
      content = h('div', { class: 'col' }, renderPlan());
    }
    if (!SERVER && S.view === 'plan') content.append(creditBlock());
    body.append(content);
    growAll(body);
    body.scrollTop = st;
    pendIndex = -1;
    renderStatus();
  }

  function renderAll() {
    renderHead();
    renderBody();
    renderComposer();
  }

  // ---------- 快捷键与自动更新 ----------

  function inField(e) {
    const el = e.composedPath ? e.composedPath()[0] : e.target;
    return el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT');
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (kit.escape()) e.preventDefault(); return; }
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = e.key.toLowerCase();
    if (k === 's') {
      e.preventDefault();
      if (S.folder.state === 'ready') folderPush().then(() => toast(t('saved')));
      else toast(t('saved_in_the_browser'));
      return;
    }
    if (inField(e)) return;
    if (k === 'z' && !e.shiftKey) { e.preventDefault(); if (!undo()) toast(t('there_is_nothing_to_undo')); }
    else if ((k === 'z' && e.shiftKey) || k === 'y') { e.preventDefault(); if (!redo()) toast(t('there_is_nothing_to_redo')); }
  });
  body.addEventListener('scroll', kit.closePop);
  {
    let depth = 0;
    const hasFiles = (e) => !!(e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types || [], 'Files') >= 0);
    const veil = h('div', { class: 'mask' }, h('div', { class: 'drop-text', text: t('drop_to_open_the_folder') }));
    app.addEventListener('dragenter', (e) => { if (!hasFiles(e)) return; e.preventDefault(); if (depth++ === 0) app.append(veil); });
    app.addEventListener('dragover', (e) => { if (hasFiles(e)) e.preventDefault(); });
    app.addEventListener('dragleave', (e) => { if (!hasFiles(e)) return; depth = Math.max(0, depth - 1); if (depth === 0) veil.remove(); });
    app.addEventListener('drop', (e) => { if (!hasFiles(e)) return; e.preventDefault(); depth = 0; veil.remove(); dropFolder(e.dataTransfer); });
  }
  let growTimer = 0;
  window.addEventListener('resize', () => {
    kit.closePop();
    clearTimeout(growTimer);
    growTimer = setTimeout(() => growAll(body), 120);
  });
  window.addEventListener('focus', () => folderPull(false, true));
  // 文件夹里的计划书一变，页面跟着更新
  setInterval(() => {
    if (document.visibilityState === 'visible' && S.folder.state === 'ready') folderPull(false, true);
  }, 3000);

  startProject();
  if (SERVER && opts.folder) connectFolderPath(opts.folder);
  renderAll();
  placeWindow();

  return {
    el: app,
    refresh: () => folderPull(false, true),
    state: () => S,
  };
}

'use strict';
// 「最近」标签里的文件夹列表（本机服务提供）：最近在用的文件夹，一键打开计划书、复制地址。

// o: { kit, current, onPick(path) }
function folderRows(container, o) {
  clear(container);
  container.append(h('p', { class: 'muted', text: t('reading_recent_folders') }));
  // 选定这个文件夹当前用哪一份，选完重新列出
  const choosePlan = (anchor, x) => o.kit.openPop(anchor, (pop) => {
    x.plans.forEach((pl) => pop.append(o.kit.popItem((pl.title || x.name) + '（' + pl.file + '）', () => {
      Api.call('POST', '/api/current', { path: x.path, file: pl.file }).then(() => folderRows(container, o), (e) => o.kit.toast(t('could_not_select_the_plan_why', { why: errText(e) })));
    }, { on: pl.file === x.file })));
  });
  Api.call('GET', '/api/projects').then((data) => {
    clear(container);
    const row = (x) => {
      const s = x.summary;
      const planBtn = x.plans && x.plans.length > 1
        ? h('button', { type: 'button', class: 'link plan-pick', onclick() { choosePlan(planBtn, x); } }, t('plan_file', { file: x.file }))
        : null;
      const info = h('div', { class: 'finfo' },
        h('div', { class: 'fname' }, h('span', { text: x.name }), x.active ? h('span', { class: 'badge', text: t('in_use') }) : null),
        h('button', { type: 'button', class: 'fpath', title: t('copy_path'), 'aria-label': t('copy_path') + '：' + x.path, onclick: () => copyThen(o.kit, x.path) }, x.path),
        planBtn,
        s ? h('div', { class: 'muted', text: t('done_of_total_done_n_left_to_fill_in', { done: s.done, total: s.total, n: s.pending }) }) : h('div', { class: 'muted', text: t('no_plan_yet') }));
      const isCur = o.current && o.current.toLowerCase() === x.path.toLowerCase();
      if (isCur) info.firstChild.append(h('span', { class: 'badge', text: t('current') }));
      // 整个框都可以点击打开；框里的按钮（复制地址、换计划书）各管各的
      const el = h('div', { class: 'frow' + (isCur ? ' cur' : ''), role: 'button', tabindex: 0, 'aria-label': x.name }, info);
      el.addEventListener('click', (e) => { if (!e.target.closest('button, a')) o.onPick(x.path); });
      el.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); o.onPick(x.path); } });
      return el;
    };
    const section = (title, list) => {
      if (!list.length) return;
      container.append(h('h3', { class: 'ftitle', text: title }));
      list.forEach((x) => container.append(row(x)));
    };
    const active = data.claude.filter((x) => x.active);
    const recent = data.claude.filter((x) => !x.active);
    section(t('folders_in_use'), active);
    section(t('recent_folders'), recent);
    section(t('connected_folders'), data.history);
    if (!data.claude.length && !data.history.length) container.append(h('p', { class: 'muted', text: t('no_recent_folders_were_found_use_the_button') }));
  }, (e) => {
    clear(container);
    container.append(h('p', { class: 'err', text: t('could_not_read_the_folder_list_why', { why: errText(e) }) }));
  });
}

// 页面悬浮窗靠浏览器扩展出现：扩展的脚本在这个页面里留下一个标记
function extensionInstalled() {
  return document.documentElement.hasAttribute('data-shupian-ext');
}

// 书签：拖到书签栏，在任意网页上点一下，把悬浮窗从本机服务加载进当前页面（不用装扩展）
function bookmarkletHref() {
  const src = location.origin + '/shupian.js?k=' + SERVER.token;
  return "javascript:(function(){var s=document.createElement('script');s.src='" + src + "&t='+Date.now();"
    + "document.documentElement.setAttribute('data-shupian-open','');document.documentElement.appendChild(s)})();void 0";
}

// 把扩展登记给浏览器（一键安装）：成功返回 true，失败提示原因并返回 false
function registerExtensionIn(kit, browser) {
  return Api.call('POST', '/api/extension', { browser: browser.id, action: 'register' }).then(() => true, (e) => {
    const missing = /409/.test(errText(e));
    kit.toast(t('could_not_register_the_extension_why', { why: missing ? t('the_extension_package_was_not_found_run_the_build') : errText(e) }));
    return false;
  });
}

// 安装内容：一键安装、书签、手动加载三种方式。info 是 /api/extension 的返回
function installContent(kit, info) {
  const openPage = (b, page) => Api.call('POST', '/api/extension', { browser: b.id, page }).catch((e) => kit.toast(t('could_not_open_the_extensions_page_why', { why: errText(e) })));
  const steps = [t('extension_step_open'), t('extension_step_load'), t('extension_step_done'), t('extension_step_button')].map((x) => h('li', { text: x }));
  const link = h('a', { class: 'bookmarklet', href: bookmarkletHref(), draggable: 'true', title: t('drag_to_the_bookmarks_bar') }, t('prompt_plan_helper'));
  link.addEventListener('click', (e) => e.preventDefault());
  const status = h('div', { class: 'ext-status' });
  const showRegistered = (b) => {
    clear(status);
    status.append(
      h('p', { class: 'hint', text: t('registered_in_name_enable_it', { name: b.name, app: t('prompt_plan_helper') }) }),
      h('button', { type: 'button', class: 'btn primary', onclick: () => openPage(b, '') }, t('open_the_extensions_page_in_name', { name: b.name })));
  };
  const oneClick = info.browsers.filter((b) => b.oneClick);
  const registeredIn = oneClick.filter((b) => b.registered)[0];
  if (registeredIn) showRegistered(registeredIn);
  const register = (b) => registerExtensionIn(kit, b).then((ok) => { if (ok) showRegistered(b); });
  return h('div', null,
    oneClick.length ? h('div', { class: 'ext-block' },
      h('h3', { text: t('one_click_install_title') }),
      h('p', { class: 'hint', text: t('one_click_install_hint') }),
      h('div', { class: 'row' }, oneClick.map((b) => h('button', { type: 'button', class: 'btn primary', onclick: () => register(b) }, t('install_to_name', { name: b.name })))),
      status) : null,
    h('div', { class: 'ext-block' },
      h('h3', { text: t('bookmark_title') }),
      h('p', { class: 'hint', text: t('bookmark_steps') }),
      link,
      h('p', { class: 'hint', text: t('bookmark_limits') }),
      info.browsers.length ? h('div', { class: 'row' }, info.browsers.map((b) => h('button', { type: 'button', class: 'btn', onclick: () => openPage(b, 'install') }, t('open_the_install_page_in_name', { name: b.name })))) : null),
    h('details', { class: 'ext-block' },
      h('summary', { text: t('manual_install') }),
      h('h3', { text: t('extension_title') }),
      h('ol', { class: 'steps' }, steps),
      h('div', { class: 'muted', text: t('extension_folder') }),
      h('button', { type: 'button', class: 'fpath', title: t('copy_path'), 'aria-label': t('copy_path') + '：' + info.path, onclick: () => copyThen(kit, info.path) }, info.path),
      info.browsers.some((b) => b.id === 'firefox') ? h('p', { class: 'hint', text: t('extension_step_firefox') }) : null,
      info.browsers.length ? null : h('p', { class: 'hint', text: t('no_edge_or_chrome_was_found') }),
      h('div', { class: 'row' }, info.browsers.map((b) => h('button', { type: 'button', class: 'btn', onclick: () => openPage(b, '') }, t('open_the_extensions_page_in_name', { name: b.name }))))),
    null);
}

async function openExtensionHelp(kit) {
  let info;
  try {
    info = await Api.call('GET', '/api/extension');
  } catch (e) {
    kit.toast(t('could_not_prepare_the_extension_why', { why: errText(e) }));
    return;
  }
  kit.openModal({
    title: t('install_the_floating_window'),
    body: installContent(kit, info),
    foot: (close) => [h('button', { type: 'button', class: 'btn', onclick: close }, t('close'))],
  });
}

// 「最近」页顶上的一行：悬浮窗要不要装扩展。检测完成前占位不显示，避免下面的内容移位。
function extensionRow(kit) {
  const row = h('div', { class: 'extrow wait' });
  setTimeout(async () => {
    // 扩展在别的浏览器里时，页面里没有标记，但扩展已经联系过本服务
    let seen = false;
    let info = null;
    try { info = await Api.call('GET', '/api/extension'); seen = !!info.seen; } catch (e) { kit.toast(t('could_not_prepare_the_extension_why', { why: errText(e) })); }
    row.classList.remove('wait');
    clear(row);
    if (extensionInstalled() || seen) {
      row.append(h('span', { class: 'muted', text: t('the_page_floating_window_is_on_alt_shift_s') }));
      return;
    }
    const added = info && info.browsers.filter((b) => b.registered)[0];
    const waiting = !!added;
    if (added) {
      row.append(h('span', { class: 'muted', text: t('the_extension_is_registered_enable_it_in_the_browser') }),
        h('button', { type: 'button', class: 'btn sm primary', onclick: () => Api.call('POST', '/api/extension', { browser: added.id, page: '' }).catch((e) => kit.toast(t('could_not_open_the_extensions_page_why', { why: errText(e) }))) }, t('open_the_extensions_page_in_name', { name: added.name })));
    } else {
      row.append(h('span', { class: 'muted', text: t('the_page_floating_window_needs_the_browser_extension') }),
        h('button', { type: 'button', class: 'btn sm primary', onclick: () => openExtensionHelp(kit) }, t('install_the_browser_extension')));
    }
    // 第一次打开、扩展还没装也没登记：自动登记给本机的 Edge、Chrome，再弹出说明（浏览器会提示启用），只做一次
    if (!waiting && !LS.get('shupian:ext-asked', false)) {
      LS.set('shupian:ext-asked', true);
      Promise.all(info.browsers.filter((b) => b.oneClick).map((b) => registerExtensionIn(kit, b))).then(() => openExtensionHelp(kit));
    }
  }, 1200);
  row.append(h('span', { class: 'muted', text: t('the_page_floating_window_is_on_alt_shift_s') }));
  return row;
}

'use strict';
// 悬浮在别的页面上的小窗：在每一条问题上指出一个东西，或框一块区域、记下当前页面，用列表一次写下多个问题，合成一段话复制给 AI。
// 在浏览器扩展里并且打开过桌面小窗口时，每一行可以选一个功能（输入 @ 切换），再一起记到计划书里对应功能的下面。

function createFeedback(opts) {
  const tools = opts.tools;
  const app = h('div', { class: 'app fb' });
  const body = h('div', { class: 'fb-body' });
  const foot = h('div', { class: 'fb-foot' });
  const kit = createKit(app);
  // 当前页面的信息和截图，整批问题共用
  const S = { info: null, shot: null, naming: null };
  // 计划书通道：off（不可用，why 说明原因）、loading、ready、empty（没有计划书或没有功能）
  // projects 里每一项是一份计划书：{ path, name（文件夹名）, file, summary, multi（这个文件夹里有多份）}
  const link = { state: Link.available ? 'loading' : 'off', why: '', projects: [], project: null, features: [], target: null };
  const targetKey = NS + ':target';
  const planName = (x) => ((x.summary && x.summary.title) || x.name) + (x.multi ? '（' + x.file + '）' : '');
  const fileUrl = (x, file) => '/api/file?root=' + encodeURIComponent(x.path) + '&p=' + encodeURIComponent(file);
  // 开始做之后问题记在功能清单里：已有功能清单就读它；计划书已确认但还没有功能清单时由计划书生成，记问题时才创建文件；
  // 计划书还没确认就是计划书本身。返回 { file（记到哪个文件）, exists, text }
  async function readDoc(x) {
    const s = x.summary || {};
    if (s.hasFeatures) return Object.assign({ file: s.featureFile }, await Link.call('GET', fileUrl(x, s.featureFile)));
    const plan = await Link.call('GET', fileUrl(x, x.file));
    if (plan.exists && s.status === 'approved' && s.featureFile) return { file: s.featureFile, exists: true, text: Core.makeFeatureList(plan.text) };
    return Object.assign({ file: x.file }, plan);
  }
  const featLabel = (f) => (f.no ? f.no + ' ' : '') + f.name;

  // 未提交的问题草稿：能连到计划书时存在项目文件夹里（桌面窗口读同一份），否则存在这个页面的浏览器本地；写入按顺序排队
  const draftKey = NS + ':draft';
  let draftTimer = 0;
  let draftChain = Promise.resolve();
  let draftExists = false;
  const draftUrl = () => (link.state === 'ready' && link.project ? fileUrl(link.project, Draft.rel(link.project.file)) : '');

  async function loadDraft() {
    const url = draftUrl();
    if (!url) return LS.get(draftKey, []);
    const r = await Link.call('GET', url);
    return r.exists ? Draft.parse(r.text) : [];
  }

  function queueDraft(rows) {
    if (!rows.length && !draftExists) return;
    draftExists = rows.length > 0;
    const url = draftUrl();
    draftChain = draftChain.then(async () => {
      if (url) await Link.call('PUT', url, Draft.text(rows));
      else if (!LS.set(draftKey, rows)) throw new Error(t('browser_storage_is_full_and_the_latest'));
    }).catch((e) => kit.toast(t('could_not_save_the_draft_why', { why: e.message === 'down' ? t('the_desktop_window_did_not_respond') : errText(e) })));
  }

  async function restoreDraft() {
    try {
      const rows = await loadDraft();
      if (rows.length && !list.items().length) { draftExists = true; list.restore(rows); }
    } catch (e) {
      kit.toast(t('could_not_load_the_draft_why', { why: errText(e) }));
    }
  }

  const list = createIssueList({
    kit,
    features: () => (link.state === 'ready' ? link.features : Parts.list()),
    placeholder: () => (link.state === 'ready' ? t('describe_the_issue_you_can_several_features')
      : Parts.list().length ? t('describe_the_issue_you_can_several_parts') : t('describe_what_to_change')),
    onTarget(f) { if (link.state === 'ready') { link.target = f; rememberTarget(); } },
    onChange() {
      clearTimeout(draftTimer);
      draftTimer = setTimeout(() => queueDraft(list.snapshot()), 500);
    },
    // 每一条可以带多个元素：下面一个元素一行，可以单独去掉
    rowExtra(row, repaint) {
      const els = row.data.elements || [];
      if (!els.length) return null;
      return h('div', null, els.map((e, i) => h('div', { class: 'chipline' }, h('span', { text: e.path }),
        h('button', { type: 'button', class: 'x', title: t('clear'), onclick() { els.splice(i, 1); repaint(); } }, '✕'))));
    },
    onLayout() { if (opts.onLayout) opts.onLayout(); },
  });

  const logo = document.createElement('span');
  logo.className = 'logo';
  logo.innerHTML = ICON_SVG;
  // 标题栏：按住拖动窗口（在 mount 里处理），右边的按钮收起成悬浮图标
  const head = h('div', { class: 'fb-head' }, logo, h('span', { class: 'fb-title', text: t('page_feedback') }),
    h('button', { type: 'button', class: 'btn sm collapse', onclick() { if (opts.onClose) opts.onClose(); } }, t('collapse')));
  app.append(head, body, foot);
  const section = (title, hint) => h('div', { class: 'fb-sec' }, h('div', { class: 'fb-sec-title', text: title }), hint ? h('p', { class: 'hint', text: hint }) : null);

  function infoLines() {
    if (!S.info) return [];
    const i = S.info;
    const out = [];
    if (i.title) out.push(t('page_title_label') + i.title);
    if (i.headings.length) out.push(t('headings_label') + i.headings.join(' / '));
    if (i.controls.length) out.push(t('controls_label') + i.controls.join(' / '));
    return out;
  }

  const elementsOf = (it) => it.data.elements || [];
  // 多个元素编号，一个元素不编号
  const numbered = (arr, pick) => arr.map((e, i) => (arr.length > 1 ? (i + 1) + ') ' : '') + pick(e)).join(arr.length > 1 ? '\n' : '');

  // 记进计划书时，每条后面带上页面地址和元素
  function whereText(it) {
    const ctx = tools.context();
    const out = [];
    try { const u = new URL(ctx.page); out.push(t('where_page') + u.host + u.pathname); } catch (e) { /* 地址不是标准网址时不写页面 */ }
    elementsOf(it).forEach((e) => out.push(t('where_element') + e.path));
    return out.length ? '（' + out.join('；') + '）' : '';
  }

  function feedbackText() {
    const ctx = tools.context();
    const items = list.items();
    const errors = tools.errors();
    const shot = S.shot ? t('the_screenshot_is_on_the_clipboard_paste_it') : '';
    const one = (it, first) => Core.buildFeedback({
      text: it ? it.text : '', page: ctx.page, view: ctx.view,
      element: it ? numbered(elementsOf(it), (e) => e.path) : '', styles: it ? numbered(elementsOf(it), (e) => e.styles) : '',
      summary: first ? infoLines() : [], errors: first ? errors : [], shot: first ? shot : '',
    }, LANG);
    const text = items.length <= 1 ? one(items[0], true)
      : items.map((it, i) => (i + 1) + '. ' + (it.fs.length ? it.fs.map((f) => '@ ' + featLabel(f)).join(' ') : '') + '\n' + one(it, i === 0)).join('\n');
    return extraLines(items).concat(text).join('\n');
  }

  // 没有连计划书时：被 @ 的部件在页面上的位置，和调过的参数
  function extraLines(items) {
    if (link.state === 'ready') return [];
    const out = [];
    const seen = [];
    items.forEach((it) => it.fs.forEach((f) => {
      if (f.sel && seen.indexOf(f.name) < 0) { seen.push(f.name); out.push(t('where_part') + f.name + '（' + f.sel + '）'); }
    }));
    const stage = Stages.current();
    if (stage) out.push(t('stage_label', { name: stage.name }));
    Tune.changed().forEach((c) => out.push(t('tuned_value', { label: c.label, value: c.value, was: c.was })));
    return out.length ? [out.join('\n')] : [];
  }

  // ---------- 本页部件：没有连计划书时，这个网页上有什么 ----------

  const samePart = (a, b) => !!(a && b && a.name === b.name);
  const keepTarget = () => { const cur = list.defaultF; return cur ? Parts.list().filter((x) => samePart(x, cur))[0] || null : null; };

  async function circlePart() {
    const r = await tools.pick();
    if (!r) return;
    S.naming = { sel: r.sel, name: r.label };
    render();
    setTimeout(() => { const i = body.querySelector('.part-name'); if (i) { i.focus({ preventScroll: true }); i.select(); } }, 0);
  }

  function savePart(name) {
    const v = name.trim();
    if (!v) { kit.toast(t('the_name_cannot_be_empty')); return; }
    if (Parts.list().some((x) => x.declared && x.name === v)) { kit.toast(t('there_is_already_a_what_with_this_name', { what: t('part') })); return; }
    if (!Parts.add(v, S.naming.sel)) { kit.toast(t('browser_storage_is_full_and_the_latest')); return; }
    S.naming = null;
    list.syncTargets(keepTarget());
    render();
  }

  function removePart(p) {
    Parts.remove(p.name);
    list.syncTargets(keepTarget());
    render();
  }

  // 点部件：当前这一条问题 @ 它，之后新加的也默认是它
  function usePart(p) {
    const row = list.focusedRow();
    if (!row.text.trim()) row.fs = [p];
    else if (!row.fs.some((x) => samePart(x, p))) row.fs.push(p);
    list.defaultF = p;
    list.paint();
    row.ta.focus({ preventScroll: true });
  }

  function partsBlock() {
    if (link.state === 'ready') return null;
    const box = section(t('parts'), Parts.list().length ? t('click_a_part_to_aim_the_note_at_it') : '');
    box.classList.add('parts');
    box.append(h('div', { class: 'row tight' }, h('button', { type: 'button', class: 'btn', onclick: circlePart }, t('circle_a_part'))));
    if (S.naming) {
      const input = h('input', { class: 'in part-name', placeholder: t('part_name'), 'aria-label': t('part_name'), value: S.naming.name });
      input.addEventListener('keydown', (e) => {
        if (e.isComposing) return;
        if (e.key === 'Enter') { e.preventDefault(); savePart(input.value); }
        if (e.key === 'Escape') { e.preventDefault(); S.naming = null; render(); }
      });
      box.append(h('div', { class: 'row tight' }, input,
        h('button', { type: 'button', class: 'btn sm primary', onclick: () => savePart(input.value) }, t('add')),
        h('button', { type: 'button', class: 'btn sm', onclick() { S.naming = null; render(); } }, t('cancel'))));
    }
    const on = list.defaultF;
    const chips = Parts.list().map((p) => h('span', { class: 'ftag part' },
      h('button', { type: 'button', class: 'btn sm' + (samePart(on, p) ? ' primary' : ''), title: p.sel, onclick: () => usePart(p) }, p.name),
      p.declared ? null : h('button', { type: 'button', class: 'x', title: t('remove_this_part'), 'aria-label': t('remove_this_part'), onclick: () => removePart(p) }, '✕')));
    if (chips.length) box.append(h('div', { class: 'part-list' }, chips));
    return box;
  }

  // 进度档位：一排选项，点一个就把那一档的所有参数一起设好
  function stagesBlock() {
    const stages = Stages.list();
    if (!stages.length || !Tune.list().length) return null;
    const box = section(t('stage_title'));
    const row = h('div', { class: 'stage-row' });
    stages.forEach((s) => row.append(h('button', { type: 'button', class: 'chip' + (Stages.current() === s ? ' on' : ''), onclick() {
      Stages.apply(s);
      const top = body.scrollTop;
      render();
      body.scrollTop = top;
    } }, s.name)));
    box.append(row);
    return box;
  }

  // 网页声明的可调参数：滑块加数字框，调了立刻交给网页，并记在这个浏览器里
  function tuneBlock() {
    const items = Tune.list();
    if (!items.length) return null;
    const box = section(t('tune_title'));
    box.classList.add('tune');
    // 手动改了值，进度档位的高亮跟着更新
    const syncStages = () => Array.prototype.forEach.call(body.querySelectorAll('.stage-row .chip'), (b, i) => b.classList.toggle('on', Stages.list()[i] === Stages.current()));
    items.forEach((x) => {
      const name = x.label || x.key;
      const step = x.step || (x.max - x.min) / 100;
      const show = (v) => String(Number(Number(v).toFixed(4)));
      const range = h('input', { class: 'tune-range', type: 'range', min: x.min, max: x.max, step, value: Tune.value(x), 'aria-label': name });
      const num = h('input', { class: 'in tune-num', type: 'text', inputmode: 'decimal', 'aria-label': name, value: show(Tune.value(x)) });
      range.addEventListener('input', () => { num.value = show(Tune.set(x, range.value)); syncStages(); });
      num.addEventListener('input', () => { num.value = num.value.replace(/[^0-9.-]/g, ''); });
      num.addEventListener('change', () => {
        const v = Tune.set(x, num.value);
        num.value = show(v);
        range.value = String(v);
        syncStages();
      });
      box.append(h('div', { class: 'tune-row' }, h('span', { class: 'tune-label', text: name }), range, num));
    });
    return box;
  }

  async function loadPlan() {
    link.features = [];
    if (!link.project) { link.state = 'empty'; return; }
    const f = await readDoc(link.project);
    if (!f.exists) { link.state = 'empty'; return; }
    link.features = Core.issueList(f.text);
    const saved = LS.get(targetKey, null) || {};
    const keep = link.target || (saved.path === link.project.path && saved.file === link.project.file ? saved : null);
    link.target = (keep && link.features.filter((x) => x.no === keep.no && x.name === keep.name)[0]) || link.features[0] || null;
    link.state = link.target ? 'ready' : 'empty';
  }

  async function loadLink() {
    if (!Link.available) { await restoreDraft(); render(); return; }
    link.state = 'loading';
    try {
      const data = await Link.call('GET', '/api/projects');
      link.projects = [];
      data.claude.concat(data.history).forEach((x) => (x.plans || []).forEach((p) => {
        link.projects.push({ path: x.path, name: x.name, file: p.file, summary: p, active: x.active, current: p.file === x.file, multi: x.plans.length > 1 });
      }));
      const same = (a, b) => b && a.path === b.path && a.file === b.file;
      const saved = LS.get(targetKey, null);
      link.project = link.projects.filter((x) => same(x, saved))[0] || link.projects.filter((x) => same(x, data.last))[0]
        || link.projects.filter((x) => x.active && x.current)[0] || link.projects.filter((x) => x.current)[0] || null;
      await loadPlan();
    } catch (e) {
      link.state = 'off';
      link.why = e.message === 'unpaired' ? 'unpaired' : 'down';
    }
    list.syncTargets(link.state === 'ready' ? link.target : null);
    await restoreDraft();
    render();
  }

  function rememberTarget() {
    if (link.project && link.target) LS.set(targetKey, { path: link.project.path, file: link.project.file, no: link.target.no, name: link.target.name });
  }

  // 换一份计划书
  function choosePlan(anchor) {
    kit.openPop(anchor, (pop, close) => {
      link.projects.forEach((x) => pop.append(h('button', { type: 'button', class: x === link.project ? 'on' : '', onclick: async () => {
        close();
        // 换计划书之前，把现在写的存进原来那份的草稿
        clearTimeout(draftTimer);
        queueDraft(list.snapshot());
        link.project = x;
        link.target = null;
        try { await loadPlan(); } catch (e) { link.state = 'off'; link.why = 'down'; }
        rememberTarget();
        list.syncTargets(link.state === 'ready' ? link.target : null);
        render();
      } }, planName(x))));
    });
  }

  async function record() {
    const items = list.items();
    if (!items.length) { kit.toast(t('write_the_issue_first')); return; }
    if (items.some((it) => !it.fs.length)) { kit.toast(t('choose_a_feature_for_every_issue')); return; }
    try {
      const f = await readDoc(link.project);
      const feats = f.exists ? Core.issueList(f.text) : [];
      // 一条问题 @ 了几个功能，就记到每个功能下面
      const hits = [];
      items.forEach((it) => it.fs.forEach((g) => hits.push({ it, g, hit: feats.filter((x) => x.no === g.no && x.name === g.name)[0] })));
      const lost = hits.filter((x) => !x.hit);
      if (lost.length) {
        await loadPlan();
        list.syncTargets(link.state === 'ready' ? link.target : null);
        render();
        kit.toast(t('these_features_are_no_longer_in_the_plan', { names: lost.map((x) => featLabel(x.g)).join(LOCALES[LANG].doc.listSep) }));
        return;
      }
      const r = Core.addIssues(f.text, hits.map((x) => ({ featureLine: x.hit.featureLine, text: x.it.text + whereText(x.it) })), Core.today());
      if (!r.ok) { kit.toast(t('write_the_issue_first')); return; }
      await Link.call('PUT', fileUrl(link.project, f.file), r.md);
      clearTimeout(draftTimer);
      queueDraft([]);
      list.reset(link.target);
      render();
      kit.toast(t('added_n_issues_to_the_plan', { n: r.added }));
    } catch (e) {
      kit.toast(t('could_not_add_to_the_plan_why', { why: e.message === 'down' ? t('the_desktop_window_did_not_respond') : errText(e) }));
    }
  }

  function setShot(r) {
    if (S.shot && S.shot.url) URL.revokeObjectURL(S.shot.url);
    S.shot = r ? { blob: r.blob, kind: r.kind, url: URL.createObjectURL(r.blob) } : null;
  }

  // 选取一个元素，加到指定的这一条上；可以连着选多个
  async function pickInto(row) {
    const r = await tools.pick();
    if (!r) return;
    (row.data.elements = row.data.elements || []).push({ path: r.path, styles: r.styles });
    list.paint();
    render();
  }

  async function region() {
    try {
      const r = await tools.region();
      if (!r) return;
      setShot(r);
      render();
    } catch (e) {
      kit.toast(t('capture_failed_why', { why: errText(e) }));
    }
  }

  async function currentPage() {
    try {
      const r = await tools.page();
      S.info = r.info;
      setShot(r.shot);
      render();
    } catch (e) {
      kit.toast(t('capture_failed_why', { why: errText(e) }));
    }
  }

  async function copyShot() {
    if (!S.shot) return;
    if (await copyImage(S.shot.blob)) { kit.toast(t('screenshot_copied')); return; }
    kit.toast(t('downloaded_name', { name: download(S.shot.blob, 'screenshot', 'webp', 'image/webp') }));
  }

  function render() {
    clear(body);
    clear(foot);
    const ready = link.state === 'ready';
    const where = section(t('point_it_out'));
    where.append(h('div', { class: 'actions three' },
      h('button', { type: 'button', class: 'btn', onclick: () => pickInto(list.focusedRow()) }, t('pick_an_element')),
      h('button', { type: 'button', class: 'btn', onclick: region }, t('region_screenshot')),
      h('button', { type: 'button', class: 'btn', onclick: currentPage }, t('current_page'))));
    if (S.info) {
      where.append(h('div', { class: 'chipline' }, h('span', { text: t('current_page_title', { title: S.info.title || tools.context().page }) }),
        h('button', { type: 'button', class: 'x', title: t('clear'), onclick() { S.info = null; render(); } }, '✕')));
    }
    if (S.shot) {
      where.append(h('div', { class: 'chipline' },
        h('img', { class: 'shot', src: S.shot.url, alt: t('screenshot') }),
        h('span', { text: S.shot.kind === 'simulated' ? t('kind_fake_shot') : t('kind_shot') }),
        h('button', { type: 'button', class: 'x', title: t('clear'), onclick() { setShot(null); render(); } }, '✕')));
    }
    body.append(where);
    if (ready) {
      const plan = section(t('plan'));
      if (link.projects.length > 1) {
        const pick = h('button', { type: 'button', class: 'link plan-pick', title: t('change_the_plan') }, planName(link.project) + ' ▾');
        pick.addEventListener('click', () => choosePlan(pick));
        plan.append(pick);
      } else {
        plan.append(h('div', { class: 'hint', text: planName(link.project) }));
      }
      body.append(plan);
    } else if (link.state !== 'loading' && Link.available) {
      const why = link.state === 'empty' ? (link.project ? t('this_plan_has_no_features_yet') : t('no_folder_with_a_plan_was_found'))
        : link.why === 'unpaired' ? t('open_the_desktop_window_first_to_add_issues') : t('the_desktop_window_did_not_respond_only');
      body.append(h('div', { class: 'fb-sec' }, h('p', { class: 'hint', text: why })));
    }
    [partsBlock(), stagesBlock(), tuneBlock()].forEach((x) => { if (x) body.append(x); });
    const write = section(t('write_a_note'));
    write.append(list.el);
    body.append(write);
    foot.append(h('div', { class: 'actions' },
      ready ? h('button', { type: 'button', class: 'btn primary', onclick: record }, t('add_to_plan')) : null,
      h('button', { type: 'button', class: ready ? 'btn' : 'btn primary', onclick() { copyThen(kit, feedbackText()); } }, t('copy_text')),
      S.shot ? h('button', { type: 'button', class: 'btn', onclick: copyShot }, t('copy_screenshot')) : null));
    // 内容长高后，窗口要重新拉回屏幕内
    setTimeout(() => { if (opts.onLayout) opts.onLayout(); }, 0);
  }

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && kit.escape()) e.preventDefault(); });
  render();
  loadLink();
  return { el: app };
}

'use strict';
// 挂载：有 #shupian-app 就整页显示（桌面小窗口或计划书页）；否则作为小悬浮窗叠在当前页面上。

function styleEl() {
  return h('style', { text: CSS });
}

// 打开或屏幕尺寸变化时：整个窗口都要在屏幕内（放不下就贴左上）
function fitPos(pos, w, hgt) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: Math.round(Math.min(Math.max(pos.x, 0), Math.max(0, vw - w))),
    y: Math.round(Math.min(Math.max(pos.y, 0), Math.max(0, vh - hgt))),
  };
}

// 拖动时：最多允许出去一半，标题栏始终在屏幕里
function clampPos(pos, w, hgt) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: Math.round(Math.min(Math.max(pos.x, -w / 2), vw - w / 2)),
    y: Math.round(Math.min(Math.max(pos.y, 0), vh - Math.min(hgt, vh) / 2)),
  };
}

function dragWith(el, shouldStart, getPos, setPos, onTap) {
  let st = null;
  el.addEventListener('pointerdown', (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    if (shouldStart && !shouldStart(e)) return;
    const p = getPos();
    st = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: p.x, y: p.y, moved: false };
    try { el.setPointerCapture(e.pointerId); } catch (err) { /* 指针已结束 */ }
  });
  el.addEventListener('pointermove', (e) => {
    if (!st || e.pointerId !== st.id) return;
    const dx = e.clientX - st.sx;
    const dy = e.clientY - st.sy;
    if (!st.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
    st.moved = true;
    setPos({ x: st.x + dx, y: st.y + dy }, false);
  });
  const end = (e) => {
    if (!st || e.pointerId !== st.id) return;
    const s = st;
    st = null;
    if (s.moved) setPos(getPos(), true);
    else if (onTap) onTap(e);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}

function mountPage(host) {
  const params = new URLSearchParams(location.search);
  const root = host.attachShadow({ mode: 'open' });
  root.append(styleEl());
  const wrap = h('div', { style: 'width:100%;height:100%' });
  const inst = createApp({ root, defaultName: t('new_project'), folder: params.get('folder') || '' });
  wrap.append(inst.el);
  root.append(wrap);
  document.title = t('prompt_plan_helper');
  document.documentElement.lang = LANG === 'zh' ? 'zh-CN' : 'en';
  return { open() {}, close() {}, toggle() {}, mode: 'plan' };
}

function nextFrames(n) {
  return new Promise((resolve) => {
    const step = (i) => (i <= 0 ? resolve() : requestAnimationFrame(() => step(i - 1)));
    step(n);
  });
}

function mountFloat(autoOpen) {
  if (window.top !== window) return null;
  // 页面自己引入了脚本又装了扩展时只留一份：扩展的那份能连桌面小窗口
  const existing = document.querySelector('[data-shupian]');
  if (existing) {
    if (!Link.available) return null;
    existing.remove();
  }
  installErrorHook();
  const host = document.createElement('div');
  host.setAttribute('data-shupian', '');
  host.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;z-index:2147483000';
  document.documentElement.appendChild(host);
  const root = host.attachShadow({ mode: 'open' });
  root.append(styleEl());
  const win = h('div', { class: 'win', style: 'display:none' });
  const fab = h('button', { type: 'button', class: 'fab', title: t('prompt_plan_helper') + '（Alt+Shift+S）', 'aria-label': t('prompt_plan_helper') });
  fab.innerHTML = ICON_SVG;
  root.append(win, fab);

  let built = false;
  let isOpen = false;
  const winKey = NS + ':win';
  const fabKey = NS + ':fab';

  const savedWinPos = () => LS.get(winKey, null) || { x: window.innerWidth - win.offsetWidth - 12, y: window.innerHeight - win.offsetHeight - 12 };
  const winPos = () => {
    const r = win.getBoundingClientRect();
    return { x: r.left, y: r.top };
  };
  const placeWin = (pos, save, loose) => {
    const w = win.offsetWidth;
    const hh = win.offsetHeight;
    const p = loose ? clampPos(pos, w, hh) : fitPos(pos, w, hh);
    win.style.left = p.x + 'px';
    win.style.top = p.y + 'px';
    if (save) LS.set(winKey, p);
  };
  const dragWin = (pos, final) => placeWin(pos, final, true);
  const fabPos = () => {
    const saved = LS.get(fabKey, null);
    const s = fab.offsetWidth || 54;
    const base = saved || { x: window.innerWidth - s - 14, y: window.innerHeight - s - 14 };
    return { x: Math.min(Math.max(base.x, 0), window.innerWidth - s), y: Math.min(Math.max(base.y, 0), window.innerHeight - s) };
  };
  const placeFab = (pos, save) => {
    const s = fab.offsetWidth || 54;
    const p = { x: Math.min(Math.max(pos.x, 0), window.innerWidth - s), y: Math.min(Math.max(pos.y, 0), window.innerHeight - s) };
    fab.style.left = p.x + 'px';
    fab.style.top = p.y + 'px';
    if (save) LS.set(fabKey, p);
  };

  // 截图和选取元素时窗口先藏起来
  const whileHidden = async (fn) => {
    const was = win.style.display;
    win.style.display = 'none';
    fab.style.display = 'none';
    try {
      await nextFrames(2);
      return await fn();
    } finally {
      win.style.display = was;
      if (!isOpen) fab.style.display = '';
    }
  };
  const viewShot = async () => (await realShot()) || (await domShot());
  const tools = {
    // 当前页面：一下记下页面的信息，并存一张整个可见区域的图
    page: () => whileHidden(async () => ({ info: pageInfo(), shot: await viewShot() })),
    // 区域截图：拖出一块区域，只存这一块
    region: async () => {
      const rect = await whileHidden(() => pickRegion(root));
      if (!rect) return null;
      return whileHidden(async () => cropShot(await viewShot(), rect));
    },
    pick: () => whileHidden(() => pickElement(root)),
    errors: () => pageErrors.slice(),
    context: () => ({ page: location.href, view: window.innerWidth + '×' + window.innerHeight }),
  };

  const open = () => {
    if (!built) {
      win.append(createFeedback({ tools, onClose: close, onLayout: () => { if (isOpen) placeWin(winPos(), false, false); } }).el);
      built = true;
    }
    isOpen = true;
    win.style.display = '';
    fab.style.display = 'none';
    placeWin(savedWinPos(), false, false);
  };
  function close() {
    isOpen = false;
    win.style.display = 'none';
    fab.style.display = '';
    placeFab(fabPos(), false);
  }
  const toggle = () => (isOpen ? close() : open());

  dragWith(fab, null, fabPos, placeFab, toggle);
  // 窗口里除了按钮和输入框，哪里都能按住拖动
  dragWith(win, (e) => {
    const path = e.composedPath ? e.composedPath() : [];
    for (let i = 0; i < path.length; i++) {
      const n = path[i];
      if (n === win) break;
      if (n.tagName === 'BUTTON' || n.tagName === 'INPUT' || n.tagName === 'TEXTAREA' || n.tagName === 'IMG') return false;
    }
    return true;
  }, winPos, dragWin);

  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.code === 'KeyS') { e.preventDefault(); toggle(); }
  }, true);
  window.addEventListener('resize', () => {
    if (isOpen) placeWin(winPos(), false, false);
    else placeFab(fabPos(), false);
  });
  placeFab(fabPos(), false);
  if (autoOpen) open();

  return { open, close, toggle, mode: 'float' };
}

(function boot() {
  // 书签方式下再点一次，悬浮窗开或收
  if (window.Shupian) {
    if (BOOKMARK && typeof window.Shupian.toggle === 'function') window.Shupian.toggle();
    return;
  }
  const params = new URLSearchParams(location.search);
  const want = params.get('shupian') || (location.hash.indexOf('#shupian-') === 0 ? location.hash.slice(9) : '');
  const start = () => {
    const page = document.getElementById('shupian-app');
    if (page && Link.available && SERVER) {
      document.documentElement.setAttribute('data-shupian-ext', '');
      chrome.runtime.sendMessage({ shupian: 'pair', port: location.port, token: SERVER.token }, () => void chrome.runtime.lastError);
      return;
    }
    if (!page && !meAllowed()) return;
    const api = page ? mountPage(page) : mountFloat(!!want || document.documentElement.hasAttribute('data-shupian-open'));
    if (!api) return;
    if (!page) Tune.restore();
    window.Shupian = api;
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener((msg) => {
        if (msg && msg.shupian === 'toggle') api.toggle();
      });
    }
    window.addEventListener('message', (e) => {
      if (e.source === window && e.data && typeof e.data.shupian === 'string') {
        if (e.data.shupian === 'close') api.close();
        else api.open();
      }
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

})();
