"""
============================================================
SteelNest 自动询盘邮件系统 — 主入口
============================================================
统一调度：发送 → 检查回复 → AI 解析

用法：
    python main.py --action send            # 发送询盘
    python main.py --action check           # 检查回复
    python main.py --action parse           # AI 解析回复
    python main.py --action all             # 执行完整流程
    python main.py --action send --dry-run  # 预览发送
============================================================
"""

import sys
import argparse
import datetime
from pathlib import Path

# 自动加载 .env 文件（优先级：email-worker/.env > 项目根目录 .env.local）
try:
    from dotenv import load_dotenv
    env_file = Path(__file__).resolve().parent / ".env"
    if env_file.exists():
        load_dotenv(env_file)
    else:
        root_env = Path(__file__).resolve().parent.parent / ".env.local"
        if root_env.exists():
            load_dotenv(root_env)
except ImportError:
    pass


def main():
    parser = argparse.ArgumentParser(
        description="SteelNest 自动询盘邮件系统",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例：
  python main.py --action send                    # 发送第1轮询盘
  python main.py --action send --round 2           # 发送第2轮跟进
  python main.py --action send --dry-run           # 预览模式
  python main.py --action check                    # 检查供应商回复
  python main.py --action parse                    # AI 解析回复
  python main.py --action all                      # 完整流程
        """
    )
    parser.add_argument(
        "--action",
        choices=["send", "check", "parse", "all"],
        required=True,
        help="执行的操作"
    )
    parser.add_argument("--round", type=int, default=1, help="邮件轮次 (1/2/3)")
    parser.add_argument("--dry-run", action="store_true", help="预览模式")
    parser.add_argument("--id", type=str, help="指定 inquiry ID (parse 用)")

    args = parser.parse_args()

    print(f"\n{'='*60}")
    print(f"  SteelNest 自动询盘邮件系统")
    print(f"  时间: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"  操作: {args.action}")
    print(f"{'='*60}")

    try:
        if args.action in ("send", "all"):
            from send_inquiries import send_inquiries
            send_inquiries(round_num=args.round, dry_run=args.dry_run)

        if args.action in ("check", "all"):
            from check_replies import check_replies
            check_replies()

        if args.action in ("parse", "all"):
            from ai_parser import parse_replies
            parse_replies(inquiry_id=args.id)

        print(f"\n[完成] 所有操作已完成")

    except ImportError as e:
        print(f"\n[ERROR] 缺少依赖模块: {e}")
        print("[INFO] 请先安装依赖: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] 执行失败: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
