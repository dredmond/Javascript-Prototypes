using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace HexViewer
{
    public class BackupParser
    {
        private readonly byte[] _data;

        public int Offset { get; private set; }

        public int Length
        {
            get { return _data.Length; }
        }

        public BackupParser(string file)
        {
            if (!File.Exists(file))
                throw new FileNotFoundException(file);

            _data = File.ReadAllBytes(file);
        }

        private bool IsValidRequest(int size)
        {
            return Offset + size < Length;
        }

        public bool HasReachedEof()
        {
            return Offset >= Length;
        }

        public ushort ReadInt16()
        {
            if (!IsValidRequest(2))
                throw new BytesNotAvailableException("ReadInt", 2);

            var bytes = ReadBytes(2);
            var result = BitConverter.ToUInt16(bytes, 0);
            //Offset += 2;

            var b1 = (result >> 0) & 0xff;
            var b2 = (result >> 8) & 0xff;
            result = (ushort)(b1 << 8 | b2 << 0);

            return result;
        }

        public uint ReadInt32()
        {
            if (!IsValidRequest(4))
                throw new BytesNotAvailableException("ReadInt", 4);

            var bytes = ReadBytes(2);
            var result = BitConverter.ToUInt32(bytes, 0);
            //Offset += 2;

            var b1 = (result >> 0) & 0xff;
            var b2 = (result >> 8) & 0xff;
            var b3 = (result >> 0) & 0xff;
            var b4 = (result >> 8) & 0xff;
            result = (b1 << 24 | b2 << 16 | b3 << 8 | b4 << 0);

            return result;
        }

        public byte[] ReadBytes(int size)
        {
            if (!IsValidRequest(size))
                throw new BytesNotAvailableException("ReadBytes", size);

            var result = new byte[size];

            for (var i = 0; i < size; i++)
            {
                result[i] = _data[Offset + i];
            }

            Offset += size;

            return result;
        }

        public string ReadString()
        {
            var stringSize = -1;

            try
            {
                stringSize = ReadInt16();
            }
            catch (Exception ex)
            {
                throw new BytesNotAvailableException("ReadString", stringSize, ex);
            }

            return ReadString(stringSize);
        }

        public string ReadString(int size)
        {
            if (size <= 0)
                return "";

            if (!IsValidRequest(size))
                throw new BytesNotAvailableException("ReadString", size);

            byte[] bytes;

            try
            {
                bytes = ReadBytes(size);
            }
            catch (Exception ex)
            {
                throw new BytesNotAvailableException("ReadString", size, ex);
            }

            var result = Encoding.ASCII.GetString(bytes);
            return result;
        }

        public FileType ReadFileType()
        {
            var fileType = FileType.Unknown;

            try
            {
                var typeInt = ReadInt16();

                switch (typeInt)
                {
                    case (ushort)FileType.Directory:
                        fileType = FileType.Directory;
                        break;
                    case (ushort)FileType.File:
                        fileType = FileType.File;
                        break;
                }
            }
            catch (Exception ex)
            {
                throw new BytesNotAvailableException("ReadFileType", 2, ex);
            }

            return fileType;
        }
    }
}
