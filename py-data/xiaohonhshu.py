from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
import csv
import random

# 反检测设置 
edge_options = Options()
edge_options.add_experimental_option('excludeSwitches', ['enable-automation'])    # 开启开发者模式(顶部)
edge_options.add_argument('--disable-blink-features=AutomationControlled')        # 禁用启用Blink运行时的功能

driver = webdriver.Chrome(options=edge_options)
driver.get("https://www.xiaohongshu.com/explore")
driver.maximize_window()
time.sleep(10)

driver.find_element(By.CSS_SELECTOR,'#search-input').send_keys('kimi')
time.sleep(2)
driver.find_element(By.CSS_SELECTOR,'#headerContainer > header > div.input-box > div > div.search-icon').click()

time.sleep(2)



for i in range(500):
    items = driver.find_elements(By.CSS_SELECTOR,'.note-item')
    for item in items:
        title = item.find_element(By.CSS_SELECTOR,'.title span').text
        author = item.find_element(By.CSS_SELECTOR,'.author span').text
        love = item.find_element(By.CSS_SELECTOR,'.count').text
        url = item.find_element(By.CSS_SELECTOR,'.title').get_attribute('href')
        imgUrl = item.find_element(By.CSS_SELECTOR,'.cover.ld.mask img').get_attribute('src')
        with open('xiaohongshu.csv',mode='a',newline='',encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow([title,author,love,url,imgUrl])
        print(title,imgUrl)
    js="var q=document.documentElement.scrollTop=10000"  # 滚动到最下面
    driver.execute_script(js)
    time.sleep(4)