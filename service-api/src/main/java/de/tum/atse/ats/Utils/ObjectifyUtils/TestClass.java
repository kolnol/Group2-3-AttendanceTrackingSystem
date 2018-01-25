package de.tum.atse.ats.Utils.ObjectifyUtils;

import de.tum.atse.ats.Entity.User;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

@TestAnnotation(db = ObjectifyDatabaseImpl.class)
public class TestClass {
    //DatabaseInterface db = createDBFromAnnotation(this.getClass().getName());

    private DatabaseInterface createDBFromAnnotation(String className) throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        Class<?> clazz = Class.forName(className);
        Constructor<?> ctor = clazz.getConstructor();
        Object object = ctor.newInstance();
        return (DatabaseInterface) object;
    }

    private Class getAnnotation(Class clazz) {
        if (clazz.isAnnotationPresent(TestAnnotation.class)) {
            TestAnnotation anno = (TestAnnotation) clazz.getAnnotation(TestAnnotation.class);
            return anno.db();
        }
        return null;
    }


}
